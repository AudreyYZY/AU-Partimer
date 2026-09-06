// LLM Client Service
// Configures the AI SDK provider for DeepSeek/MiMo compatible API

import { createOpenAI } from "@ai-sdk/openai";

// Create a provider instance configured for DeepSeek/MiMo API
// The API is OpenAI-compatible, so we use the OpenAI provider with custom base URL
export const llmProvider = createOpenAI({
  apiKey: process.env.MIMO_API_KEY ?? "",
  baseURL: process.env.MIMO_BASE_URL ?? "https://api.deepseek.com",
});

// Default model to use
export const DEFAULT_MODEL = process.env.MIMO_MODEL ?? "deepseek-v4-flash";

/**
 * Get the model instance for a given model ID
 */
export function getModel(modelId?: string) {
  return llmProvider(modelId ?? DEFAULT_MODEL);
}
