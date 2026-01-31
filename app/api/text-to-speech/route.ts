import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Instead of calling ElevenLabs API, return a flag indicating to use browser Web Speech API
    return NextResponse.json({
      useBrowserSpeech: true,
      text: text,
      message: "Text received, use browser Web Speech API to synthesize"
    });
  } catch (error: any) {
    console.error("Text-to-speech request error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process text-to-speech request" },
      { status: 500 }
    );
  }
}
