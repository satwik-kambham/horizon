import { AIChatBackend } from "./AIChatBackend";
import { HuggingFaceAIChatBackend } from "./HuggingFaceAIChatBackend";

export class AIChatService {
  private currentBackend: AIChatBackend;

  constructor() {
    this.currentBackend = new HuggingFaceAIChatBackend();
  }

  setBackend(backend: AIChatBackend): void {
    this.currentBackend = backend;
  }

  async sendMessage(message: string): Promise<string> {
    return this.currentBackend.sendMessage(message);
  }

  getConversationHistory() {
    return this.currentBackend.getConversationHistory();
  }

  clearConversation() {
    this.currentBackend.clearConversation();
  }
}

export const aiChatService = new AIChatService();
