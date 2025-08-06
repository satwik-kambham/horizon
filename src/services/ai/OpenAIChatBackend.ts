import { ref } from "vue";
import { AIChatBackend, ChatMessage, ExtraChatArgs } from "./AIChatBackend";

export class OpenAIChatBackend implements AIChatBackend {
  public conversationHistory = ref<ChatMessage[]>([]);

  constructor() {
    this.conversationHistory.value = [];
  }

  async sendMessage(
    message: string,
    extraArgs?: ExtraChatArgs,
  ): Promise<string> {
    this.conversationHistory.value.push({
      role: "user",
      content: message,
    });

    const requestBody = {
      model: extraArgs?.modelName,
      messages: this.conversationHistory.value,
      temperature: extraArgs?.temperature,
      seed: extraArgs?.seed,
      stream: false,
    };

    try {
      const response = await fetch(extraArgs?.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(extraArgs?.apiKey ? { Authorization: `Bearer ${extraArgs?.apiKey}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      this.conversationHistory.value.push({
        role: "assistant",
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  clearConversation(): void {
    this.conversationHistory.value = [];
  }

  getBackendStatus(): "ready" | "initializing" | "error" {
    return "ready";
  }
}
