// src/types/llm.types.ts
export type LLMProvider = 'openai' | 'anthropic' | 'llama';

export interface BaseLLMConfig {
  provider: LLMProvider;
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
}

export type LLMConfig = OpenAIConfig | AnthropicConfig | LlamaConfig;

export interface TokenUsage {
  totalTokens: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface LLMResponse {
  text: string;
  usage?: TokenUsage;
}