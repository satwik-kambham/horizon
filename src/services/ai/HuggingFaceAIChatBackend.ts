import { AIChatBackend, ChatMessage } from './AIChatBackend';
import { ref } from 'vue';
import {
  pipeline,
  TextStreamer,
  env,
} from "@huggingface/transformers";

export class HuggingFaceAIChatBackend implements AIChatBackend {
  private conversationHistory = ref<ChatMessage[]>([]);
  private generator: any;
  private modelId = "Qwen2.5-0.5B-Instruct";

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      console.log("Initializing Model");
      env.allowRemoteModels = false;
      env.allowLocalModels = true;
      env.localModelPath = '/models';
      this.generator = await pipeline(
        "text-generation",
        this.modelId,
        { dtype: "q4f16" },
      );
      console.log("Model initialized successfully");
    } catch (error) {
      console.error("Error initializing Hugging Face model:", error);
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      this.conversationHistory.value.push({
        role: 'user',
        content: message,
      });

      const output = await this.generator(this.conversationHistory.value, {
        max_new_tokens: 512,
        streamer: new TextStreamer(this.generator.tokenizer, { skip_prompt: true, skip_special_tokens: true }),
      });

      const response = output[0].generated_text.at(-1).content;
      
      this.conversationHistory.value.push({
        role: 'assistant',
        content: response,
      });

      return response;
    } catch (error) {
      console.error("Error generating response from Hugging Face model:", error);
      const fallbackResponse = `Error generating response. Please try again later.`;
      this.conversationHistory.value.push({
        role: 'assistant',
        content: fallbackResponse,
      });
      return fallbackResponse;
    }
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.value;
  }

  clearConversation(): void {
    this.conversationHistory.value = [];
  }
}
