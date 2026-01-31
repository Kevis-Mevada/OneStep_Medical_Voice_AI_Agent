import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { MEDICAL_SYSTEM_PROMPT } from "@/lib/ai-prompts";

export const dynamic = 'force-dynamic';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Medical safety system prompt
const SYSTEM_PROMPT = MEDICAL_SYSTEM_PROMPT;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], userContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Build conversation context
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add user context if provided
    if (userContext) {
      const contextString = `User context: ${userContext.age ? `Age ${userContext.age}, ` : ''}${userContext.gender ? `${userContext.gender}, ` : ''}${userContext.height ? `Height ${userContext.height}, ` : ''}${userContext.weight ? `Weight ${userContext.weight}, ` : ''}${userContext.conditions ? `Known conditions: ${userContext.conditions}` : ''}`;
      messages.push({ role: "system", content: contextString.trim() });
    }

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Add current user message
    messages.push({ role: "user", content: message });

    // Get AI response from Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 300, // Keep responses concise for voice
      top_p: 0.9,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    // Check for emergency keywords based on the standard medical prompt
    const emergencyKeywords = [
      "emergency",
      "urgent",
      "immediately",
      "911",
      "emergency room",
      "seek medical attention",
      "call emergency",
      "go to hospital",
      "chest pain",
      "can't breathe",
      "severe bleeding",
      "loss of consciousness",
      "sudden severe headache",
      "signs of stroke",
      "severe allergic reactions",
      "These symptoms shouldn't be ignored",
      "contact emergency services",
      "nearest emergency room",
      "serious",
      "doctor in person",
    ];

    const isEmergency = emergencyKeywords.some((keyword) =>
      aiResponse.toLowerCase().includes(keyword.toLowerCase())
    );

    return NextResponse.json({
      response: aiResponse,
      isEmergency,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Live consultation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process consultation" },
      { status: 500 }
    );
  }
}
