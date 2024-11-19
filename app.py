import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import whisper
import librosa
import numpy as np
import torch
from dataclasses import dataclass, asdict
import time
from transformers import pipeline

@dataclass
class SpeechSegment:
    text: str
    start_time: float
    end_time: float
    confidence: float
    pitch_avg: float = 0.0
    pitch_variance: float = 0.0
    energy: float = 0.0
    speaking_rate: float = 0.0

class PresentationAnalyzer:
    def __init__(self):
        """Initialize the presentation analyzer with necessary models."""
        # Initialize Whisper for speech-to-text
        self.whisper_model = whisper.load_model("base")

        # Initialize summarizer
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

        # Determine device
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def analyze_audio_features(self, audio_path, start_time, end_time):
        """Extract audio features for a segment."""
        try:
            # Load audio segment
            y, sr = librosa.load(
                audio_path,
                offset=start_time,
                duration=end_time - start_time
            )

            # Extract pitch (fundamental frequency)
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
            pitch_avg = np.mean(pitches[magnitudes > np.max(magnitudes) * 0.1])
            pitch_variance = np.var(pitches[magnitudes > np.max(magnitudes) * 0.1])

            # Calculate energy (volume)
            energy = np.mean(librosa.feature.rms(y=y))

            # Speaking rate (rough approximation using zero crossings)
            zero_crossings = librosa.zero_crossings(y)
            speaking_rate = sum(zero_crossings) / (end_time - start_time)

            return {
                'pitch_avg': float(pitch_avg) if not np.isnan(pitch_avg) else 0.0,
                'pitch_variance': float(pitch_variance) if not np.isnan(pitch_variance) else 0.0,
                'energy': float(energy),
                'speaking_rate': float(speaking_rate)
            }
        except Exception as e:
            print(f"Error analyzing audio features: {str(e)}")
            return {
                'pitch_avg': 0.0,
                'pitch_variance': 0.0,
                'energy': 0.0,
                'speaking_rate': 0.0
            }

    def analyze_presentation(self, video_path):
        """Analyze presentation metrics from video."""
        try:
            # Transcribe video
            result = self.whisper_model.transcribe(video_path)

            # Get full transcription
            full_transcription = result['text']

            # Generate summary
            summary = self.summarizer(full_transcription, max_length=130, min_length=30)[0]['summary_text']

            # Convert to speech segments with audio features
            segments = []
            time_series_data = {
                'timestamps': [],
                'pitch': [],
                'energy': [],
                'speaking_rate': [],
                'confidence': []
            }

            for segment in result['segments']:
                # Analyze audio features for this segment
                audio_features = self.analyze_audio_features(
                    video_path,
                    segment['start'],
                    segment['end']
                )

                # Create speech segment
                speech_segment = SpeechSegment(
                    text=segment['text'],
                    start_time=segment['start'],
                    end_time=segment['end'],
                    confidence=segment.get('confidence', 0.8),
                    **audio_features
                )
                segments.append(speech_segment)

                # Add to time series data
                time_series_data['timestamps'].append(float(segment['start']))
                time_series_data['pitch'].append(audio_features['pitch_avg'])
                time_series_data['energy'].append(audio_features['energy'])
                time_series_data['speaking_rate'].append(audio_features['speaking_rate'])
                time_series_data['confidence'].append(segment.get('confidence', 0.8))

            # Calculate overall metrics
            metrics = self._calculate_metrics(segments)

            return {
                'segments': [asdict(seg) for seg in segments],
                'time_series_data': time_series_data,
                'full_transcription': full_transcription,
                'summary': summary,
                **metrics
            }
        except Exception as e:
            return {'error': str(e)}

    def _calculate_metrics(self, segments):
        """Calculate various presentation metrics."""
        # Clarity (based on confidence)
        clarity_scores = [seg.confidence for seg in segments]
        overall_clarity = np.mean(clarity_scores) if clarity_scores else 0.0

        # Pace calculation
        word_counts = [len(seg.text.split()) for seg in segments]
        durations = [seg.end_time - seg.start_time for seg in segments]

        # Words per minute calculation
        wpm_segments = [
            (word_count / max(duration, 0.1)) * 60
            for word_count, duration in zip(word_counts, durations)
        ]
        average_pace = np.mean(wpm_segments) if wpm_segments else 0.0

        # Vocabulary complexity
        unique_words = set(' '.join(seg.text for seg in segments).lower().split())
        total_words = sum(len(seg.text.split()) for seg in segments)
        vocabulary_score = len(unique_words) / total_words if total_words > 0 else 0.0

        # Audio metrics
        pitch_scores = [seg.pitch_avg for seg in segments]
        energy_scores = [seg.energy for seg in segments]
        speaking_rates = [seg.speaking_rate for seg in segments]

        # Calculate enthusiasm score (combination of pitch variance, energy, and speaking rate)
        enthusiasm_score = np.mean([
            np.mean(pitch_scores) if pitch_scores else 0.0,
            np.mean(energy_scores) if energy_scores else 0.0,
            np.mean(speaking_rates) if speaking_rates else 0.0
        ])

        return {
            'overall_clarity': float(overall_clarity),
            'average_pace_wpm': float(average_pace),
            'vocabulary_score': float(vocabulary_score),
            'enthusiasm_score': float(enthusiasm_score)
        }

# Flask Application Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Global analyzer instance
analyzer = PresentationAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """API endpoint for video analysis."""
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400

    video_file = request.files['video']

    # Save temporary file
    temp_path = f'/tmp/video_{int(time.time())}.mp4'
    video_file.save(temp_path)

    try:
        # Analyze presentation
        results = analyzer.analyze_presentation(temp_path)

        # Clean up temporary file
        os.remove(temp_path)

        return jsonify(results)
    except Exception as e:
        # Ensure temp file is removed even if analysis fails
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection."""
    emit('status', {'message': 'Connected to analysis server'})

@socketio.on('analyze_stream')
def handle_stream_analysis(data):
    """Handle real-time stream analysis."""
    # Placeholder for stream analysis logic
    emit('analysis_update', {
        'status': 'Stream analysis not fully implemented',
        'data': data
    })

# Entry point for running the Flask app
if __name__ == '__main__':
    # For local development
    socketio.run(app, debug=True, port=5000)