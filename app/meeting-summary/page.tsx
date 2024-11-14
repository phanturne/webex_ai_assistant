"use client";

import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Progress} from "@/components/ui/progress"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {AlertCircle, Mic, TrendingUp, Zap} from 'lucide-react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

export default function WebexEnhancedAIAnalysis() {
  const [activeTab, setActiveTab] = useState("clarity")

  const aiAnalysis = {
    clarity: {
      score: 85,
      fillerWords: [
        {word: "um", count: 12},
        {word: "uh", count: 8},
        {word: "like", count: 15},
      ],
      longPauses: 3,
      suggestion: "Try to reduce the use of filler words, especially 'like'. Take a breath instead of using filler words when you need a moment to think."
    },
    pacing: {
      averageWPM: 145,
      wpmOverTime: [
        {time: '0:00', wpm: 130},
        {time: '5:00', wpm: 150},
        {time: '10:00', wpm: 160},
        {time: '15:00', wpm: 140},
        {time: '20:00', wpm: 145},
      ],
      suggestion: "Your average pace is good. Try to maintain a consistent speed throughout your presentation."
    },
    tone: {
      pitchVariation: 70,
      monotoneInstances: 2,
      suggestion: "Your tone variation is good, but there were a couple of instances where you sounded monotone. Try to vary your pitch more during key points."
    },
    bodyLanguage: {
      eyeContact: 80,
      posture: 90,
      gestures: 75,
      suggestion: "Your body language is generally positive. Try to use more hand gestures to emphasize key points."
    },
    vocabulary: {
      complexityScore: 65,
      jargonUsed: ["synergy", "paradigm shift", "leverage"],
      suggestion: "Consider simplifying some terms. For example, instead of 'leverage', you could say 'use' or 'take advantage of'."
    },
    confidence: {
      overallScore: 88,
      voiceStability: 90,
      volumeConsistency: 85,
      suggestion: "Your confidence levels are high. Maintain this assurance throughout your presentations."
    },
    energy: {
      overallScore: 82,
      vocalVariety: 80,
      facialExpressions: 85,
      suggestion: "Your energy is good, but try to increase vocal variety a bit more to keep the audience engaged."
    }
  }

  const renderMetricCard = (title: string, score: number, icon: React.ReactNode, description: string, hidePercentage = false) => (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#005073]">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#005073]">{score}{hidePercentage ? "" : "%"}</div>
        <p className="text-xs text-[#6d6e71]">{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 max-w-5xl bg-[#f7f7f7]">
      <h1 className="text-3xl font-bold mb-6 text-[#005073]">Webex AI Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderMetricCard("Speech Clarity", aiAnalysis.clarity.score, <Mic
          className="h-4 w-4 text-[#00bceb]"/>, "Filler words and articulation")}
        {renderMetricCard("Pacing", aiAnalysis.pacing.averageWPM, <TrendingUp
          className="h-4 w-4 text-[#00bceb]"/>, "Words per minute", true)}
        {renderMetricCard("Energy", aiAnalysis.energy.overallScore, <Zap
          className="h-4 w-4 text-[#00bceb]"/>, "Vocal variety and expressions")}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-md">
        <TabsList className="grid w-full grid-cols-7 bg-[#00bceb] rounded-t-lg">
          {["clarity", "pacing", "tone", "body language", "vocabulary", "confidence", "energy"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-white data-[state=active]:bg-[#005073] data-[state=active]:text-white"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea className="rounded-b-lg p-4">
          <TabsContent value="clarity">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Speech Clarity and Articulation</h2>
            <div className="space-y-4">
              <Progress value={aiAnalysis.clarity.score} className="w-full h-2 bg-[#e6e6e6]"
                        indicatorClassName="bg-[#00bceb]"/>
              <p className="text-[#005073] font-medium">Filler Words Used:</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={aiAnalysis.clarity.fillerWords}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6"/>
                  <XAxis dataKey="word" tick={{fill: '#005073'}}/>
                  <YAxis tick={{fill: '#005073'}}/>
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #00bceb'}}/>
                  <Bar dataKey="count" fill="#00bceb"/>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[#005073]">Number of Long Pauses: {aiAnalysis.clarity.longPauses}</p>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.clarity.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="pacing">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Pacing and Speech Rate</h2>
            <div className="space-y-4">
              <p className="text-[#005073]">Average Words Per Minute: {aiAnalysis.pacing.averageWPM}</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={aiAnalysis.pacing.wpmOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6"/>
                  <XAxis dataKey="time" tick={{fill: '#005073'}}/>
                  <YAxis tick={{fill: '#005073'}}/>
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #00bceb'}}/>
                  <Line type="monotone" dataKey="wpm" stroke="#00bceb" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.pacing.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="tone">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Tone and Pitch Variation</h2>
            <div className="space-y-4">
              <Progress value={aiAnalysis.tone.pitchVariation} className="w-full h-2 bg-[#e6e6e6]"
                        indicatorClassName="bg-[#00bceb]"/>
              <p className="text-[#005073]">Pitch Variation: {aiAnalysis.tone.pitchVariation}%</p>
              <p className="text-[#005073]">Monotone Instances: {aiAnalysis.tone.monotoneInstances}</p>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.tone.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="body language">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Body Language and Facial Expressions</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Eye Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.bodyLanguage.eyeContact} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Posture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.bodyLanguage.posture} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Gestures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.bodyLanguage.gestures} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
              </div>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.bodyLanguage.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="vocabulary">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Word Choice and Vocabulary</h2>
            <div className="space-y-4">
              <Progress value={aiAnalysis.vocabulary.complexityScore} className="w-full h-2 bg-[#e6e6e6]"
                        indicatorClassName="bg-[#00bceb]"/>
              <p className="text-[#005073]">Vocabulary Complexity Score: {aiAnalysis.vocabulary.complexityScore}%</p>
              <p className="text-[#005073]">Jargon Used:</p>
              <ul className="list-disc list-inside text-[#005073]">
                {aiAnalysis.vocabulary.jargonUsed.map((word, index) => (
                  <li key={index}>{word}</li>
                ))}
              </ul>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.vocabulary.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="confidence">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Confidence and Emotional Analysis</h2>
            <div className="space-y-4">
              <Progress value={aiAnalysis.confidence.overallScore} className="w-full h-2 bg-[#e6e6e6]"
                        indicatorClassName="bg-[#00bceb]"/>
              <p className="text-[#005073]">Overall Confidence Score: {aiAnalysis.confidence.overallScore}%</p>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Voice Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.confidence.voiceStability} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Volume Consistency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.confidence.volumeConsistency} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
              </div>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.confidence.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="energy">
            <h2 className="text-2xl font-semibold mb-4 text-[#005073]">Energy and Enthusiasm</h2>
            <div className="space-y-4">
              <Progress value={aiAnalysis.energy.overallScore} className="w-full h-2 bg-[#e6e6e6]"
                        indicatorClassName="bg-[#00bceb]"/>
              <p className="text-[#005073]">Overall Energy Score: {aiAnalysis.energy.overallScore}%</p>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Vocal Variety</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.energy.vocalVariety} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#005073]">Facial Expressions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={aiAnalysis.energy.facialExpressions} className="w-full h-2 bg-[#e6e6e6]"
                              indicatorClassName="bg-[#00bceb]"/>
                  </CardContent>
                </Card>
              </div>
              <Alert className="bg-[#e6f6fb] border-[#00bceb]">
                <AlertCircle className="h-4 w-4 text-[#00bceb]"/>
                <AlertTitle className="text-[#005073]">Suggestion</AlertTitle>
                <AlertDescription className="text-[#6d6e71]">
                  {aiAnalysis.energy.suggestion}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}