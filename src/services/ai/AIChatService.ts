import { MockAIChatBackend, AIChatBackend } from './AIChatBackend';

export class AIChatService {
  private currentBackend: AIChatBackend;

  constructor() {
    this.currentBackend = new MockAIChatBackend();
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
