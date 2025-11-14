import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateText, type LanguageModel, stepCountIs, tool } from "ai";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({ path: "../.env" });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-haiku-4-5");
const openAIModel = openai("gpt-5");

const weatherTool = tool({
  description: "Get the weather in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  outputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    temperature: z.number().describe("The temperature for the location."),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: Math.floor(Math.random() * 50) - 10,
  }),
});

async function getWeather(prompt: string, model: LanguageModel) {
  const { text, steps } = await generateText({
    model,
    prompt,
    system: `Your purpose is to get the weather for the specified city.`,
    tools: {
      getWeather: weatherTool,
    },
    stopWhen: stepCountIs(5),
  });

  return text;
}

const response = await getWeather(
  "What is the weather in Cluj-Napoca?",
  googleModel
);
console.log(response);
