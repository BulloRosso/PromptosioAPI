// src/llm/llm-config.interface.ts
export interface BaseLLMConfig {
  provider: 'openai' | 'anthropic' | 'llama';
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

export interface OpenAIConfig extends BaseLLMConfig {
  provider: 'openai';
  presencePenalty?: number;
  frequencyPenalty?: number;
  topP?: number;
}

export interface AnthropicConfig extends BaseLLMConfig {
  provider: 'anthropic';
  topK?: number;
  topP?: number;
}

export interface LlamaConfig extends BaseLLMConfig {
  provider: 'llama';
  modelPath: string;
  contextWindow?: number;
  batchSize?: number;
}

export type LLMConfig = OpenAIConfig | AnthropicConfig | LlamaConfig;