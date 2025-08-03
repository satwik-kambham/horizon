import { ref } from "vue";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatBackend {
  conversationHistory: ChatMessage[];
  sendMessage(message: string): Promise<string>;
  clearConversation(): void;
  getBackendStatus(): "ready" | "initializing" | "error";
}

export class MockAIChatBackend implements AIChatBackend {
  public conversationHistory = ref<ChatMessage[]>([]);

  constructor() {
    this.conversationHistory.value = [];
  }

  async sendMessage(message: string): Promise<string> {
    this.conversationHistory.value.push({
      role: "user",
      content: message,
    });

    const mockResponse = `You said: "${message}". This is a mock response.`;

    this.conversationHistory.value.push({
      role: "assistant",
      content: mockResponse,
    });

    return mockResponse;
  }

  clearConversation(): void {
    this.conversationHistory.value = [];
  }

  getBackendStatus(): "ready" | "initializing" | "error" {
    return "ready";
  }
}