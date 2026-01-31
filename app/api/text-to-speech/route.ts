// This endpoint is kept for potential future use
// Currently, text-to-speech is handled directly in the browser using Web Speech API
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Return text for browser Web Speech API to synthesize
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
