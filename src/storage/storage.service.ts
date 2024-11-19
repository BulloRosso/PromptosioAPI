// src/storage/storage.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { Client } from "@replit/object-storage";
import { Prompt } from "../types/prompt.types";

// Define the type as per Replit's actual implementation
type ReplitStorageObject = {
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
};

@Injectable()
export class StorageService {
  private readonly client: Client;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.client = new Client();
  }

  async savePrompt(prompt: Prompt): Promise<void> {
    const fileName = `prompts/${prompt.id}_${prompt.version}.json`;
    const { ok, error } = await this.client.uploadFromText(
      fileName,
      JSON.stringify(prompt, null, 2),
    );

    if (!ok) {
      this.logger.error(`Failed to save prompt: ${fileName}`, error);
      throw new Error(`Failed to save prompt: ${error}`);
    }
  }

  async getPrompt(id: string, version: string): Promise<Prompt> {
    const fileName = `prompts/${id}_${version}.json`;
    const result = await this.client.downloadAsText(fileName);

    if (!result.ok || !result.value) {
      this.logger.error(`Failed to get prompt: ${fileName}`, result.error);
      throw new Error(`Prompt not found: ${id} version ${version}`);
    }

    try {
      return JSON.parse(result.value);
    } catch (error) {
      this.logger.error(`Error parsing prompt file: ${fileName}`, error);
      throw new Error(`Invalid prompt data for ${id} version ${version}`);
    }
  }

  async deletePrompt(id: string, version: string): Promise<void> {
    const fileName = `prompts/${id}_${version}.json`;
    const { ok, error } = await this.client.delete(fileName);

    if (!ok) {
      this.logger.error(`Failed to delete prompt: ${fileName}`, error);
      throw new Error(`Failed to delete prompt: ${error}`);
    }
  }

  async listPrompts(): Promise<Prompt[]> {

    console.log("*** listing prompts ***")
    const { ok, value, error } = await this.client.list();

    if (!ok) {
      this.logger.error("Failed to list prompts", error);
      throw new Error(`Failed to list prompts: ${error}`);
    }

    console.log("*** Loaded prompts ***");
    console.log(JSON.stringify(value));

    const promptFiles = value.filter((item : any) => item.name.startsWith("prompts/"));

    const prompts = await Promise.all(
      promptFiles.map(async (item: any) => {
        try {
          const result = await this.client.downloadAsText(item.name);
          if (!result.ok || !result.value) {
            this.logger.warn(`Failed to read prompt file: ${item.name}`);
            return null;
          }
          return JSON.parse(result.value);
        } catch (error) {
          this.logger.error(`Error parsing prompt file: ${item.path}`, error);
          return null;
        }
      }),
    );

    return prompts.filter((prompt): prompt is Prompt => {
      return prompt !== null && this.isValidPrompt(prompt);
    });
  }

  async getPromptVersions(id: string): Promise<string[]> {
    const { ok, value, error } = await this.client.list();

    if (!ok) {
      this.logger.error("Failed to list prompt versions", error);
      throw new Error(`Failed to list prompt versions: ${error}`);
    }

    const prefix = `prompts/${id}_`;

    return (value as unknown[])
      .filter(
        (item): item is ReplitStorageObject =>
          item && typeof item === "object" && "path" in item,
      )
      .filter((item) => item.path.startsWith(prefix))
      .map((item) => {
        const match = item.path.match(new RegExp(`${id}_(.*?).json`));
        return match ? match[1] : null;
      })
      .filter((version): version is string => version !== null);
  }

  async getSubPrompts(parentId: string): Promise<Prompt[]> {
    const allPrompts = await this.listPrompts();
    return allPrompts.filter(prompt => prompt.parentId === parentId);
  }

  private isValidPrompt(obj: any): obj is Prompt {
    return (
      obj &&
      typeof obj.id === "string" &&
      typeof obj.version === "string" &&
      typeof obj.name === "string" &&
      typeof obj.content === "string" &&
      Array.isArray(obj.staticTags) &&
      Array.isArray(obj.dynamicTags) &&
      Array.isArray(obj.conditions) &&
      Array.isArray(obj.supportedLanguages)
    );
  }
}
