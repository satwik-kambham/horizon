import { AIChatBackend, ChatMessage } from "./AIChatBackend";
import { ref } from "vue";

export class HuggingFaceAIChatBackend implements AIChatBackend {
  public conversationHistory = ref<ChatMessage[]>([]);
  private worker: Worker;
  private status = ref<"ready" | "initializing" | "error">("initializing");
  public progress = ref<{ file: string, progress: number } | null>(null);

  constructor() {
    this.worker = new Worker(new URL("./HuggingFaceWorker.ts", import.meta.url), {
      type: 'module',
    });
    
    this.worker.onmessage = (event) => {
      const { type, status, response, partial_response, error, message, progressInfo } = event.data;
      
      if (status) {
        this.status.value = status;
      }
      
      if (type === "progress" && progressInfo) {
        this.progress.value = progressInfo;
      }
      
      if (type === "response" && response) {
        const history = this.conversationHistory.value;
        if (history.length > 0 && history[history.length - 1].role === "assistant") {
          history[history.length - 1].content = response;
        }
      }
      
      if (type === "partial_response" && partial_response) {
        const history = this.conversationHistory.value;
        if (history.length > 0 && history[history.length - 1].role === "assistant") {
          history[history.length - 1].content += partial_response;
        }
      }
      
      if (type === "error" && message) {
        console.error(message);
        const fallbackResponse = `Error generating response. Please try again later.`;
        this.conversationHistory.value.push({
          role: "assistant",
          content: fallbackResponse,
        });
      }
    };
    
    this.worker.postMessage({ type: "initialize" });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      this.conversationHistory.value.push({
        role: "user",
        content: message,
      });

      this.conversationHistory.value.push({
        role: "assistant",
        content: "",
      });

      const conversationHistoryCopy = JSON.parse(JSON.stringify(this.conversationHistory.value))
      
      this.worker.postMessage({
        type: "generate",
        payload: {
          conversationHistory: conversationHistoryCopy
        }
      });
      
      return "";
    } catch (error) {
      console.error(
        "Error generating response from Hugging Face model:",
        error,
      );
      const fallbackResponse = `Error generating response. Please try again later.`;
      this.conversationHistory.value.push({
        role: "assistant",
        content: fallbackResponse,
      });
      return fallbackResponse;
    }
  }

  clearConversation(): void {
    this.conversationHistory.value = [];
  }

  getBackendStatus(): "ready" | "initializing" | "error" {
    return this.status.value;
  }
}
