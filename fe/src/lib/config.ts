export const providerNames = [
  "anthropic",
  "cohere",
  "deepseek",
  "google",
  "grok",
  "llama",
  "mistral",
  "openAi",
  "qwen"
];

export type ProviderNamesType = (typeof providerNames)[number];