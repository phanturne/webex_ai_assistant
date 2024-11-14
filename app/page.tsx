'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AnimatePresence, motion} from "framer-motion";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mic,
  MonitorUp,
  PhoneOff,
  Users,
  Video
} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function Component() {
  const [isDarkMode, setIsDarkMode] = useState(true) // Set default to true
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState({
    speed: 120,
    clarity: 75,
    fillerWords: [
      {word: 'um', count: 3},
      {word: 'like', count: 2},
      {word: 'you know', count: 1},
    ],
    pitch: 60,
    volume: 70,
    sentenceComplexity: 65,
    posture: 85
  })
  const [speedChartData, setSpeedChartData] = useState([])
  const [clarityChartData, setClarityChartData] = useState([])
  const [notification, setNotification] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  const notifications = [
    // Speech Clarity and Articulation
    "Reduce filler words like 'um' or 'uh' for clearer delivery.",
    "Try to avoid repeating words unnecessarily.",
    "Maintain a steady flow; avoid long pauses that can disrupt pacing.",

    // Pacing and Speech Rate
    "Adjust your pace—aim for around 140-160 words per minute for better clarity.",
    "Try to keep a steady pace, especially during key points.",

    // Tone and Pitch Variation
    "Add variation to your tone to avoid sounding monotone.",
    "Emphasize key words by raising or lowering your pitch slightly.",

    // Body Language and Facial Expressions (if video is on)
    "Look at the camera to create a stronger connection with viewers.",
    "Smile occasionally to convey friendliness and warmth.",
    "Maintain an open posture to appear more approachable.",

    // Word Choice and Vocabulary
    "Consider simpler language to make ideas more accessible.",
    "Avoid jargon or overly technical terms when speaking to a general audience.",

    // Confidence and Emotional Analysis
    "Speak at a steady volume to convey confidence.",
    "Keep your voice steady to maintain a calm, assured tone.",

    // Energy and Enthusiasm
    "Add energy by varying your volume and pitch.",
    "Use more animated facial expressions to convey enthusiasm."
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setAiAnalysis(prev => ({
        ...prev,
        speed: Math.min(Math.max(prev.speed + (Math.random() - 0.5) * 10, 80), 160),
        clarity: Math.min(Math.max(prev.clarity + (Math.random() - 0.5) * 5, 60), 100),
        fillerWords: prev.fillerWords.map(fw => ({
          ...fw,
          count: Math.max(0, fw.count + Math.floor((Math.random() - 0.5) * 2))
        })),
        pitch: Math.min(Math.max(prev.pitch + (Math.random() - 0.5) * 5, 40), 80),
        volume: Math.min(Math.max(prev.volume + (Math.random() - 0.5) * 5, 50), 90),
        sentenceComplexity: Math.min(Math.max(prev.sentenceComplexity + (Math.random() - 0.5) * 5, 50), 80),
        posture: Math.min(Math.max(prev.posture + (Math.random() - 0.5) * 5, 70), 100)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const time = new Date().getTime()
    setSpeedChartData(prev => [...prev, {time, speed: aiAnalysis.speed}].slice(-10))
    setClarityChartData(prev => [...prev, {time, clarity: aiAnalysis.clarity}].slice(-10))
  }, [aiAnalysis])

  useEffect(() => {
    const showInterval = setInterval(() => {
      setShowNotification(true)
      setNotification(notifications[Math.floor(Math.random() * notifications.length)])
      setTimeout(() => setShowNotification(false), 3000)
    }, 9000)

    return () => clearInterval(showInterval)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen w-full flex ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex-1 p-4 bg-background text-foreground">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-0 relative">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/3nWH0qr45ME?autoplay=1&mute=1&controls=0&loop=1&playlist=HrUWMNIoogM"
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -50}}
                        transition={{duration: 0.3}}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2"
                      >
                        <Alert className="w-64">
                          <AlertCircle className="h-4 w-4"/>
                          <AlertDescription>{notification}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                    ].map((src, i) => (
                      <div key={i} className="w-24 h-16 bg-muted-foreground overflow-hidden rounded">
                        <img src={src} alt={`Participant ${i + 1}`} className="w-full h-full object-cover"/>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center space-x-4 mb-4">
              <Button variant="outline" size="icon">
                <Mic className="h-4 w-4"/>
              </Button>
              <Button variant="outline" size="icon">
                <Video className="h-4 w-4"/>
              </Button>
              <Button variant="outline" size="icon">
                <MonitorUp className="h-4 w-4"/>
              </Button>
              <Button variant="destructive" size="icon">
                <PhoneOff className="h-4 w-4"/>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Tabs defaultValue="participants" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="participants"><Users className="h-4 w-4 mr-2"/>Participants</TabsTrigger>
                <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-2"/>Chat</TabsTrigger>
                <TabsTrigger value="ai"><Brain className="h-4 w-4 mr-2"/>AI Analysis</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <TabsContent value="participants">
                  <Card>
                    <CardHeader>
                      <CardTitle>Participants (4)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {['You', 'John Doe', 'Jane Smith', 'Bob Johnson'].map((name, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span>{name}</span>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Mic className="h-4 w-4"/>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4"/>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="chat">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 overflow-y-auto mb-4 space-y-2">
                        <div className="bg-muted p-2 rounded-lg">
                          <p className="font-semibold">John Doe</p>
                          <p>Hello everyone!</p>
                        </div>
                        <div className="bg-muted p-2 rounded-lg">
                          <p className="font-semibold">Jane Smith</p>
                          <p>Hi John, how are you?</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Input placeholder="Type a message..."/>
                        <Button>Send</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="ai">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold">Speaking Speed</p>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full"
                                 style={{width: `${(aiAnalysis.speed - 80) / 0.8}%`}}></div>
                          </div>
                          <p className="text-sm text-muted-foreground">{aiAnalysis.speed.toFixed(1)} words per
                            minute</p>
                        </div>
                        <div>
                          <p className="font-semibold">Clarity</p>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full"
                                 style={{width: `${aiAnalysis.clarity}%`}}></div>
                          </div>
                          <p className="text-sm text-muted-foreground">{aiAnalysis.clarity.toFixed(1)}% clear speech</p>
                        </div>
                        <div>
                          <p className="font-semibold">Filler Words</p>
                          <ul className="list-disc pl-5">
                            {aiAnalysis.fillerWords.map((fw, index) => (
                              <li key={index} className="text-sm">
                                "{fw.word}": used {fw.count} times
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full">
                              {isCollapsed ? 'Show More Metrics' : 'Hide Metrics'}
                              {isCollapsed ? <ChevronDown className="h-4 w-4 ml-2"/> :
                                <ChevronUp className="h-4 w-4 ml-2"/>}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4 mt-4">
                            <div>
                              <p className="font-semibold">Pitch Variation</p>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-yellow-600 h-2.5 rounded-full"
                                     style={{width: `${aiAnalysis.pitch}%`}}></div>
                              </div>
                              <p className="text-sm text-muted-foreground">{aiAnalysis.pitch.toFixed(1)}% pitch
                                variation</p>
                            </div>
                            <div>
                              <p className="font-semibold">Volume Modulation</p>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full"
                                     style={{width: `${aiAnalysis.volume}%`}}></div>
                              </div>
                              <p className="text-sm text-muted-foreground">{aiAnalysis.volume.toFixed(1)}% volume
                                variation</p>
                            </div>
                            <div>
                              <p className="font-semibold">Sentence Complexity</p>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-red-600 h-2.5 rounded-full"
                                     style={{width: `${aiAnalysis.sentenceComplexity}%`}}></div>
                              </div>
                              <p className="text-sm text-muted-foreground">{aiAnalysis.sentenceComplexity.toFixed(1)}%
                                complexity</p>
                            </div>
                            <div>
                              <p className="font-semibold">Posture and Body Language</p>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-pink-600 h-2.5 rounded-full"
                                     style={{width: `${aiAnalysis.posture}%`}}></div>
                              </div>
                              <p className="text-sm text-muted-foreground">{aiAnalysis.posture.toFixed(1)}% positive
                                body language</p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        <div className="mt-4">
                          <p className="font-semibold mb-2">Speaking Speed Over Time</p>
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={speedChartData}>
                              <CartesianGrid strokeDasharray="3 3"/>
                              <XAxis
                                dataKey="time"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                hide
                              />
                              <YAxis domain={[80, 160]} hide/>
                              <Tooltip
                                labelFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                formatter={(value) => [`${value.toFixed(1)} wpm`, 'Speed']}
                              />
                              <Line
                                type="monotone"
                                dataKey="speed"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                animationDuration={300}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4">
                          <p className="font-semibold mb-2">Clarity Over Time</p>
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={clarityChartData}>
                              <CartesianGrid strokeDasharray="3 3"/>
                              <XAxis
                                dataKey="time"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                hide
                              />
                              <YAxis domain={[0, 100]} hide/>
                              <Tooltip
                                labelFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                formatter={(value) => [`${value.toFixed(1)}%`, 'Clarity']}
                              />
                              <Line
                                type="monotone"
                                dataKey="clarity"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                                animationDuration={300}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}