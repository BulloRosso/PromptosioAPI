// src/types/eval.types.ts
export interface NodePosition {
  x: number;
  y: number;
}

export interface Prompt {
  id: string;
  version: string;
  name: string;
  content: string;

  staticTags: string[];
  dynamicTags: any[];
  conditions: Condition[];
  supportedLanguages: string[];
  parentId?: string;
  metadata?: PromptMetadata;
  config?: any;
}

export interface PromptMetadata {
  author?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  category?: string;
  labels?: string[];
  flowPosition?: NodePosition;
}

export interface PromptExecutionResult {
  promptId: string;
  version: string;
  input: Record<string, any>;
  output: string;
  timestamp: string;
  metrics: {
    tokensUsed: number;
    executionTimeMs: number;
    cost?: number;
  };
  metadata?: Record<string, any>;
}

export interface PromptExecutionContext {
  variables: Record<string, any>;
  memory?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface Condition {
  envKey: string;
  type: "matcher" | "range" | "list";
  evalFunction?: string;
  evalValue?: string;
  rangeMin?: number;
  rangeMax?: number;
  valueList?: string[];
}

export interface ValidationRule {
  type: "required" | "forbidden" | "similarity" | "custom";
  config: {
    phrases?: string[];
    threshold?: number;
    customFunction?: string;
    metadata?: Record<string, any>;
  };
}

export interface EvalMetrics {
  levenshteinDistance?: number;
  cosineSimilarity?: number;
  timingMs: number;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  customMetrics?: Record<string, number>;
}

export interface EvalConfig {
  id: string;
  promptId: string;
  name: string;
  description: string;
  inputs: Record<string, any>[];
  expectedOutputs?: string[];
  validationRules: ValidationRule[];
  metadata?: Record<string, any>;
}

export interface EvalResult {
  id: string;
  promptId: string;
  version1: string;
  version2?: string;
  timestamp: string;
  input: Record<string, any>;
  output1: string;
  output2?: string;
  metrics: EvalMetrics;
  validationResults?: {
    rule: ValidationRule;
    passed: boolean;
    score?: number;
    details?: string;
  }[];
  status: "success" | "failure";
  error?: string;
  metadata?: Record<string, any>;
}

export interface EvalSummary {
  evalId: string;
  promptId: string;
  totalRuns: number;
  successRate: number;
  averageMetrics: EvalMetrics;
  validationSummary: {
    ruleType: string;
    passRate: number;
    averageScore?: number;
  }[];
  metadata?: Record<string, any>;
}

export interface EvalRegression {
  evalId: string;
  promptId: string;
  baseVersion: string;
  newVersion: string;
  regressions: {
    inputId: string;
    metricChanges: Partial<EvalMetrics>;
    severity: "low" | "medium" | "high";
    details: string;
  }[];
  summary: {
    totalTests: number;
    regressionCount: number;
    averageImpact: number;
  };
}
