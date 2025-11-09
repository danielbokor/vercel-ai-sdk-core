import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", quiet: true });

const model = google("gemini-2.5-pro");

async function answerMyQuestion(prompt: string) {
  const result = await generateText({
    model,
    prompt,
  });

  return result.text;
}

const answer = await answerMyQuestion("what is love?");

console.log(answer);
