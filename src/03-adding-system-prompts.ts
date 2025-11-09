import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", quiet: true });

const model = google("gemini-2.5-flash");

async function answerMyQuestion(prompt: string) {
  const result = await generateText({
    model,
    prompt,
    system:
      `You are a text summarizer. ` +
      `Summarize the response. ` +
      `Be concise. ` +
      `Return only the summary. ` +
      `Do not use the phrase "here is a summary". ` +
      `Highlight relevant phrases in bold. ` +
      `The summary should be two sentences long. `,
  });

  return result.text;
}

const answer = await answerMyQuestion("what is love?");

console.log(answer);
