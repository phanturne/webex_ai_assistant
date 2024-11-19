"use client";

import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesChart } from "@/components/time-series-chart";

const PresentationUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("metrics");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform time series data for Recharts
  const transformTimeSeriesData = (data) => {
    const { timestamps, pitch, energy, speaking_rate, confidence } = data;
    return timestamps.map((timestamp, index) => ({
      timestamp: Math.round(timestamp),
      pitch: pitch[index],
      energy: energy[index],
      speaking_rate: speaking_rate[index],
      confidence: confidence[index],
    }));
  };

  // Get transformed data for charts
  const chartData = results?.time_series_data ? transformTimeSeriesData(results.time_series_data) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Presentation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target?.files[0])}
            className="mb-4"
          />
          <button
            onClick={handleFileUpload}
            disabled={!file || loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : "Analyze Presentation"}
          </button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            {["metrics", "transcription", "charts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "metrics" && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Core Metrics</h3>
                    <p>Overall Clarity: {results.overall_clarity?.toFixed(2)}</p>
                    <p>Average Pace (WPM): {results.average_pace_wpm?.toFixed(2)}</p>
                    <p>Vocabulary Score: {results.vocabulary_score?.toFixed(2)}</p>
                    <p>Enthusiasm Score: {results.enthusiasm_score?.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Summary</h3>
                    <p className="text-sm text-gray-600">{results.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "transcription" && (
            <Card>
              <CardHeader>
                <CardTitle>Full Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.segments?.map((segment, index) => (
                    <div key={index} className="p-2 hover:bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">
                        {segment.start_time.toFixed(2)}s - {segment.end_time.toFixed(2)}s
                      </p>
                      <p>{segment.text}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        Confidence: {(segment.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "charts" && (
            <Card>
              <CardHeader>
                <CardTitle>Time Series Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <TimeSeriesChart
                    data={chartData}
                    dataKey="pitch"
                    name="Pitch"
                  />
                  <TimeSeriesChart
                    data={chartData}
                    dataKey="energy"
                    name="Energy"
                  />
                  <TimeSeriesChart
                    data={chartData}
                    dataKey="speaking_rate"
                    name="Speaking Rate"
                  />
                  <TimeSeriesChart
                    data={chartData}
                    dataKey="confidence"
                    name="Confidence"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PresentationUploader;