import { Controller, Post, Body } from '@nestjs/common';
import { LLMService } from './llm.service';
import { EvalResult, EvalConfig } from './types';
import { stringSimilarity } from 'string-similarity';
import { computeLevenshteinDistance } from './utils';

@Controller('llm')
export class LLMController {
  @Post('eval')
  async evalPrompt(@Body() req: {
    promptId: string;
    version1: string;
    version2?: string;
    evalConfig: EvalConfig;
  }): Promise<EvalResult> {
    const startTime = process.hrtime();
    try {
      const prompt1 = await this.promptService.getPrompt(req.promptId, req.version1);
      const prompt2 = req.version2 ? 
        await this.promptService.getPrompt(req.promptId, req.version2) : 
        undefined;

      const llm = this.getLLMInstance(prompt1.config);

      // Track token usage for both prompts
      const result1 = await llm.generateResponseWithUsage(prompt1.content, req.evalConfig.inputs[0]);
      const result2 = prompt2 ? 
        await llm.generateResponseWithUsage(prompt2.content, req.evalConfig.inputs[0]) : 
        undefined;

      const [seconds, nanoseconds] = process.hrtime(startTime);
      const runtimeMs = seconds * 1000 + nanoseconds / 1000000;

      const metrics = {
        runtime: {
          totalMs: runtimeMs,
          startTime: new Date(Date.now() - runtimeMs).toISOString(),
          endTime: new Date().toISOString()
        },
        tokens: {
          prompt1: {
            input: result1.usage.promptTokens,
            output: result1.usage.completionTokens,
            total: result1.usage.totalTokens,
            cost: this.calculateCost(prompt1.config.model, result1.usage)
          },
          prompt2: result2 ? {
            input: result2.usage.promptTokens,
            output: result2.usage.completionTokens,
            total: result2.usage.totalTokens,
            cost: this.calculateCost(prompt2.config.model, result2.usage)
          } : undefined
        },
        similarity: {
          cosineSimilarity: result2 ? 
            stringSimilarity.compareTwoStrings(result1.output, result2.output) : 
            undefined,
          levenshteinDistance: result2 ? 
            computeLevenshteinDistance(result1.output, result2.output) : 
            undefined
        },
        validation: this.evaluateCustomMetrics(result1.output, req.evalConfig)
      };

      return {
        id: crypto.randomUUID(),
        promptId: req.promptId,
        version1: req.version1,
        version2: req.version2,
        timestamp: new Date().toISOString(),
        input: req.evalConfig.inputs[0],
        output1: result1.output,
        output2: result2?.output,
        metrics,
        status: 'success'
      };

    } catch (error) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      return {
        id: crypto.randomUUID(),
        promptId: req.promptId,
        version1: req.version1,
        version2: req.version2,
        timestamp: new Date().toISOString(),
        input: req.evalConfig.inputs[0],
        output1: '',
        metrics: {
          runtime: {
            totalMs: seconds * 1000 + nanoseconds / 1000000,
            startTime: new Date(Date.now() - (seconds * 1000)).toISOString(),
            endTime: new Date().toISOString()
          }
        },
        status: 'failure',
        error: error.message
      };
    }
  }
}