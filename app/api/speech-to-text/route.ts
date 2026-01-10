import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Use Groq's Whisper API for speech-to-text
    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });

    return NextResponse.json({
      text: transcription.text,
      success: true,
    });
  } catch (error: any) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
