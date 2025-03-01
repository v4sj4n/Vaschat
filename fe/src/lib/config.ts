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


export const prompts = [
  "Teach me about the concept of a black hole",
  "What is the meaning of life according to various philosophies?",
  "Explain quantum entanglement in simple terms",
  "What's the difference between a theory and a hypothesis in science?",
  "Can you describe the multiverse theory?",
  "What distinguishes a comet from an asteroid?",
  "Explain dark matter and its significance in cosmology",
  "How does a scientific theory differ from a law?",
  "Describe the Big Bang theory and its evidence",
  "What are the key differences between a scientific theory and a hypothesis?",
  "What is the Higgs boson and why is it called the 'God particle'?",
  "Clarify the difference between a scientific theory and a fact",
  "Why is the speed of light considered the universal speed limit?",
  "What's the distinction between a scientific theory and a principle?",
  "Explain Einstein's theory of relativity",
  "How do scientific theories differ from models?",
  "Discuss the theory of evolution by natural selection",
  "What is the difference between a theorem and a scientific theory?",
  "Explain Newton's theory of gravity",
  "What are the differences between scientific theories and principles?",
  "Describe the theory of plate tectonics",
  "How do scientific laws differ from theories?",
  "What does quantum mechanics tell us about reality?",
  "What's the difference between a scientific theory and a model?",
  "Explain the mechanism of natural selection",
  "What distinguishes a theorem from a scientific theory?",
  "Discuss general relativity and its implications",
  "What are the key differences between a scientific theory and a principle?",
  "Explain special relativity and its famous equation",
  "How do scientific theories differ from laws?",
  "What is the theory of everything and why is it sought after?",
  "What's the difference between a scientific theory and a model?",
  "Explain the theory of chaos and its applications",
  "What distinguishes a theorem from a scientific theory?"
];

// Function to randomly select 3 prompts from the array
export const  getRandomPrompts = (count: number = 3) => {
  const shuffled = prompts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
