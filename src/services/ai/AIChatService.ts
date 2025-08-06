import {
  AIChatBackend,
  ExtraChatArgs,
  MockAIChatBackend,
} from "./AIChatBackend";
import { HuggingFaceAIChatBackend } from "./HuggingFaceAIChatBackend";
import { OpenAIChatBackend } from "./OpenAIChatBackend.ts";

export class AIChatService {
  currentBackend: AIChatBackend;

  constructor() {
    this.currentBackend = new MockAIChatBackend();
  }

  setBackend(backend: AIChatBackend): void {
    this.currentBackend = backend;
  }

  async sendMessage(
    message: string,
    extraArgs?: ExtraChatArgs,
  ): Promise<string> {
    return this.currentBackend.sendMessage(message, extraArgs);
  }

  getConversationHistory() {
    return this.currentBackend.conversationHistory;
  }

  clearConversation() {
    this.currentBackend.clearConversation();
  }
}

export const aiChatService = new AIChatService();
