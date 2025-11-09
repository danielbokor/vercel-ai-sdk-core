import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", quiet: true });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-sonnet-4-5");
const openAIModel = openai("gpt-5");

async function answerMyQuestion(prompt: string, model: LanguageModel) {
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

const [googleAnswer, openAIAntswer, anthropicAnswer] = await Promise.all([
  answerMyQuestion("what is love?", googleModel),
  answerMyQuestion("what is love?", openAIModel),
  await answerMyQuestion("what is love?", anthropicModel),
]);

console.log("\n\nGoogle: ", googleAnswer);
console.log("\n\nOpenAI: ", openAIAntswer);
console.log("\n\nAnthropic: ", anthropicAnswer);
