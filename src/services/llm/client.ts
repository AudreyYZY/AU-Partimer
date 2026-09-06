// LLM Client Service
// Uses the standard OpenAI-compatible AI SDK provider.

import { createOpenAI } from "@ai-sdk/openai";

export function isLlmConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export const llmProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  baseURL: process.env.OPENAI_BASE_URL,
});

export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

/**
 * Get the model instance for a given model ID
 */
export function getModel(modelId?: string) {
  if (!isLlmConfigured()) {
    throw new Error("LLM is not configured. Set OPENAI_API_KEY to enable chat analysis.");
  }

  return llmProvider(modelId ?? DEFAULT_MODEL);
}
