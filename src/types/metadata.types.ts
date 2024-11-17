// src/types/metadata.types.ts
export interface Example {
  input: Record<string, any>;
  expectedOutput: string;
  metadata?: Record<string, any>;
}

export interface Memory {
  strategy: 'local' | 'redis' | 'database';
  ttl?: number;
  keyPattern?: string;
}

export interface PromptMetadata {
  author?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  category?: string;
  labels?: string[];
}