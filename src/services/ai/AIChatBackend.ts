import { ref } from 'vue';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatBackend {
  sendMessage(message: string): Promise<string>;
  getConversationHistory(): ChatMessage[];
  clearConversation(): void;
}

export class MockAIChatBackend implements AIChatBackend {
  private conversationHistory = ref<ChatMessage[]>([]);

  constructor() {
    this.conversationHistory.value = [];
  }

  async sendMessage(message: string): Promise<string> {
    this.conversationHistory.value.push({
      role: 'user',
      content: message,
    });

    const mockResponse = `You said: "${message}". This is a mock response.`;

    this.conversationHistory.value.push({
      role: 'assistant',
      content: mockResponse,
    });

    return mockResponse;
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.value;
  }

  clearConversation(): void {
    this.conversationHistory.value = [];
  }
}
