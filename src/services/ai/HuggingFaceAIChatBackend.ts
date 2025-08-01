import { AIChatBackend, ChatMessage } from './AIChatBackend';
import { ref } from 'vue';
import {
  AutoProcessor,
  AutoModelForImageTextToText,
  TextStreamer,
} from "@huggingface/transformers";

export class HuggingFaceAIChatBackend implements AIChatBackend {
  private conversationHistory = ref<ChatMessage[]>([]);
  private processor: any;
  private model: any;
  private modelId = "onnx-community/gemma-3n-E2B-it-ONNX";

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      this.processor = await AutoProcessor.from_pretrained(this.modelId);
      this.model = await AutoModelForImageTextToText.from_pretrained(this.modelId, {
        dtype: {
          embed_tokens: "q8",
          audio_encoder: "q8",
          vision_encoder: "fp16",
          decoder_model_merged: "q4",
        },
        device: "wasm",
      });
      console.log("Model initialized successfully");
    } catch (error) {
      console.error("Error initializing Hugging Face model:", error);
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: message },
          ],
        },
      ];
      const prompt = this.processor.apply_chat_template(messages, {
        add_generation_prompt: true,
      });

      const inputs = await this.processor(prompt, null, null, {
        add_special_tokens: false,
      });

      const outputs = await this.model.generate({
        ...inputs,
        max_new_tokens: 512,
        do_sample: false,
        streamer: new TextStreamer(this.processor.tokenizer, {
          skip_prompt: true,
          skip_special_tokens: false,
          callback_function: (text) => { console.log(text) },
        }),
      });

      const decoded = this.processor.batch_decode(
        outputs.slice(null, [inputs.input_ids.dims.at(-1), null]),
        { skip_special_tokens: true }
      );

      const response = decoded[0];
      
      this.conversationHistory.value.push({
        role: 'user',
        content: message,
      });
      this.conversationHistory.value.push({
        role: 'assistant',
        content: response,
      });

      return response;
    } catch (error) {
      console.error("Error generating response from Hugging Face model:", error);
      const fallbackResponse = `Error generating response. Please try again later. Original message: "${message}"`;
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
