import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
      return NextResponse.json(
        { error: "ElevenLabs API credentials not configured" },
        { status: 500 }
      );
    }

    console.log("Making request to ElevenLabs API with voice ID:", ELEVENLABS_VOICE_ID);
    
    // Call ElevenLabs TTS API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
          "Accept": "audio/mpeg",  // Request MP3 format
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    console.log("ElevenLabs API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error("ElevenLabs API error:", response.status, response.statusText, errorText);
      
      // Check for specific error codes
      if (response.status === 401) {
        console.error("Authentication failed - please verify your ElevenLabs API key");
      } else if (response.status === 403) {
        console.error("Access forbidden - please verify your ElevenLabs subscription");
      } else if (response.status === 404) {
        console.error("Voice ID not found - please verify your ElevenLabs voice ID");
      }
      
      return NextResponse.json(
        { 
          error: "Failed to generate speech", 
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Return audio as binary stream
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate speech" },
      { status: 500 }
    );
  }
}
