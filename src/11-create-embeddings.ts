import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { cosineSimilarity, embed, embedMany } from "ai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-haiku-4-5");
const openAIModel = openai("gpt-5");

const model = openai.embedding("text-embedding-3-small");

const values = ["Dog", "Cat", "Car", "Bike"];

const { embeddings } = await embedMany({
  model,
  values,
});

// console.dir(embeddings, { depth: null });

const vectorDatabase = embeddings.map((embedding, index) => ({
  value: values[index],
  embedding,
}));

const searchTerm = await embed({
  model,
  value: "engine",
});

const entries = vectorDatabase.map((entry) => {
  return {
    value: entry.value,
    similarity: cosineSimilarity(entry.embedding, searchTerm.embedding),
  };
});

const sortedEntries = entries.sort((a, b) => b.similarity - a.similarity);

console.dir(sortedEntries, { depth: null });
