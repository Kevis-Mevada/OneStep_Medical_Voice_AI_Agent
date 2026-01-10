'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Loader2, Volume2, AlertTriangle } from "lucide-react";
import Image from "next/image";

type ConversationStep = 
  | "welcome"
  | "collecting-context"
  | "symptoms"
  | "conversation"
  | "generating-report"
  | "complete";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function LiveConsultationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<ConversationStep>("welcome");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  // User context
  const [userContext, setUserContext] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    conditions: "",
  });

  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Start consultation with AI greeting
  const startConsultation = async () => {
    setStep("collecting-context");
    const greeting = "Hello! I'm your AI health assistant. I'm here to listen and provide general health guidance. Before we begin, may I ask a few optional questions about you? This helps me give more personalized information. You can skip any question you're not comfortable answering.";
    
    await speakText(greeting);
    addMessage("assistant", greeting);
  };

  // Add message to conversation
  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }]);
  };

  // Text-to-speech using ElevenLabs
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error("TTS failed");
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // Process audio with Whisper
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Convert to File for FormData
      const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioFile);

      // Speech-to-text
      const sttResponse = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!sttResponse.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const { text } = await sttResponse.json();
      setCurrentTranscript(text);
      addMessage("user", text);

      // Get AI response
      await getAIResponse(text);
    } catch (error) {
      console.error("Audio processing error:", error);
      alert("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
      setCurrentTranscript("");
    }
  };

  // Get AI response and speak it
  const getAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/live-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from API");
      }

      const { response: aiResponse, isEmergency: emergency } = await response.json();

      if (emergency) {
        setIsEmergency(true);
      }

      addMessage("assistant", aiResponse);
      await speakText(aiResponse);

      // Update step based on conversation flow
      if (step === "collecting-context" && messages.length > 4) {
        setStep("conversation");
      }
    } catch (error) {
      console.error("AI response error:", error);
      const errorMsg = "I apologize, but I encountered an error. Could you please repeat that?";
      addMessage("assistant", errorMsg);
      await speakText(errorMsg);
    }
  };

  // End consultation and generate report
  const endConsultation = async () => {
    if (!user) return;

    setStep("generating-report");
    
    try {
      // Compile conversation into symptoms
      const userMessages = messages.filter(m => m.role === "user").map(m => m.content).join(" ");
      
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userContext,
          symptoms: userMessages,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from API");
      }

      const data = await response.json();
      
      if (data.consultationId) {
        setStep("complete");
        setTimeout(() => {
          router.push(`/dashboard/reports/${data.consultationId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Report generation error:", error);
      alert("Failed to generate report. Please try again.");
      setStep("conversation"); // Go back to conversation on error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E0F2FE] px-4 py-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Live AI Consultation</h1>
          {step !== "welcome" && step !== "complete" && (
            <Button variant="outline" onClick={endConsultation}>
              End & Generate Report
            </Button>
          )}
        </div>

        {/* Emergency Alert */}
        {isEmergency && (
          <Card className="border-[#DC2626] bg-[#FEF2F2] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-[#DC2626]" />
              <div>
                <p className="font-semibold text-[#DC2626]">Emergency Detected</p>
                <p className="text-sm text-slate-700">
                  The AI has detected symptoms that may require urgent medical attention. Please contact emergency
                  services or visit the nearest emergency room immediately.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Welcome Screen */}
        {step === "welcome" && (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative h-32 w-32">
                <Image
                  src="/Agent.jpeg"
                  alt="AI Health Assistant"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Ready to Start Your Health Consultation?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  I'll guide you through a live voice conversation. Just speak naturally, and I'll listen and respond
                  in real-time. This is a safe space for general health information.
                </p>
              </div>
              <Button onClick={startConsultation} size="lg" className="mt-4">
                Start Live Consultation
              </Button>
              <p className="text-xs text-slate-500">
                This assistant provides general health information only and does not replace medical advice.
              </p>
            </div>
          </Card>
        )}

        {/* Live Conversation Interface */}
        {(step === "collecting-context" || step === "conversation") && (
          <div className="flex flex-col gap-6">
            {/* AI Agent Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <Image
                    src="/Agent.jpeg"
                    alt="AI Assistant"
                    fill
                    className="rounded-full object-cover"
                  />
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-20 w-20 animate-ping rounded-full bg-[#0F766E] opacity-30"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">AI Health Assistant</h3>
                  <p className="text-sm text-slate-600">
                    {isSpeaking ? "Speaking..." : isListening ? "Listening..." : isProcessing ? "Processing..." : "Ready to listen"}
                  </p>
                </div>
                {isSpeaking && <Volume2 className="h-6 w-6 animate-pulse text-[#0F766E]" />}
              </div>
            </Card>

            {/* Conversation Messages */}
            <Card className="max-h-96 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-500">Conversation will appear here...</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-[#0F766E] text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {currentTranscript && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg bg-[#0F766E] px-4 py-2 text-white opacity-50">
                      <p className="text-sm">{currentTranscript}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Voice Control Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={isListening ? stopRecording : startRecording}
                disabled={isSpeaking || isProcessing}
                className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all ${
                  isListening
                    ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                    : "bg-[#0F766E] hover:bg-[#0D6560]"
                } ${(isSpeaking || isProcessing) ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {isProcessing ? (
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                ) : isListening ? (
                  <>
                    <MicOff className="h-10 w-10 text-white" />
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#DC2626] opacity-30"></div>
                  </>
                ) : (
                  <Mic className="h-10 w-10 text-white" />
                )}
              </button>
              <p className="text-sm font-medium text-slate-700">
                {isListening ? "Tap to stop recording" : isSpeaking ? "AI is speaking..." : isProcessing ? "Processing..." : "Tap to speak"}
              </p>
            </div>
          </div>
        )}

        {/* Generating Report */}
        {step === "generating-report" && (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#0F766E]" />
              <h2 className="text-xl font-semibold text-slate-900">Generating Your Health Report</h2>
              <p className="text-sm text-slate-600">
                Please wait while I compile our conversation into a detailed health guidance report...
              </p>
            </div>
          </Card>
        )}

        {/* Complete */}
        {step === "complete" && (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Consultation Complete</h2>
              <p className="text-sm text-slate-600">
                Your report has been generated and saved. Redirecting you to view it...
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
