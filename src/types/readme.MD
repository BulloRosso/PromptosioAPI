# prompt.types.ts

classDiagram
  class Prompt {
    +string id
    +string version
    +string name
    +string content
    +string[] staticTags
    +any[] dynamicTags
    +Condition[] conditions
    +string[] supportedLanguages
    +string parentId
    +any metadata
    +any config
  }

  class PromptExecutionResult {
    +string promptId
    +string version
    +Record<string,any> input
    +string output
    +string timestamp
    +Metrics metrics
    +Record<string,any> metadata
  }

  class Metrics {
    +number tokensUsed
    +number executionTimeMs
    +number cost
  }

  class PromptExecutionContext {
    +Record<string,any> variables
    +Record<string,any> memory
    +Record<string,any> metadata
  }

  class Condition {
    +string envKey
    +string type
    +string evalFunction
    +string evalValue
    +number rangeMin
    +number rangeMax
    +string[] valueList
  }

  class ValidationRule {
    +string type
    +Config config
  }

  class Config {
    +string[] phrases
    +number threshold
    +string customFunction
    +Record<string,any> metadata
  }

  class EvalMetrics {
    +number levenshteinDistance
    +number cosineSimilarity
    +number timingMs
    +TokenUsage tokenUsage
    +number cost
    +Record<string,number> customMetrics
  }

  class TokenUsage {
    +number prompt
    +number completion
    +number total
  }

  class EvalConfig {
    +string id
    +string promptId
    +string name
    +string description
    +Record<string,any>[] inputs
    +string[] expectedOutputs
    +ValidationRule[] validationRules
    +Record<string,any> metadata
  }

  class EvalResult {
    +string id
    +string promptId
    +string version1
    +string version2
    +string timestamp
    +Record<string,any> input
    +string output1
    +string output2
    +EvalMetrics metrics
    +ValidationResult[] validationResults
    +string status
    +string error
    +Record<string,any> metadata
  }

  class ValidationResult {
    +ValidationRule rule
    +boolean passed
    +number score
    +string details
  }

  class EvalSummary {
    +string evalId
    +string promptId
    +number totalRuns
    +number successRate
    +EvalMetrics averageMetrics
    +ValidationSummary[] validationSummary
    +Record<string,any> metadata
  }

  class ValidationSummary {
    +string ruleType
    +number passRate
    +number averageScore
  }

  class EvalRegression {
    +string evalId
    +string promptId
    +string baseVersion
    +string newVersion
    +Regression[] regressions
    +Summary summary
  }

  class Regression {
    +string inputId
    +Partial<EvalMetrics> metricChanges
    +string severity
    +string details
  }

  class Summary {
    +number totalTests
    +number regressionCount
    +number averageImpact
  }
