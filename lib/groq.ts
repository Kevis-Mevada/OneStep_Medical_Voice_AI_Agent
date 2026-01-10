import Groq from "groq-sdk";
import { MEDICAL_SYSTEM_PROMPT } from "./ai-prompts";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runMedicalChat(messages: { role: "user" | "assistant" | "system"; content: string }[]) {
  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: MEDICAL_SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: 0.4,
  });

  const choice = result.choices[0];
  return choice.message?.content ?? "";
}
