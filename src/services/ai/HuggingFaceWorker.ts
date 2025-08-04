import { pipeline, TextStreamer, env } from "@huggingface/transformers";
import { ChatMessage } from "./AIChatBackend";

const modelId = "onnx-community/Qwen3-0.6B-ONNX";
let generator: any = null;
let isInitialized = false;

async function initializeModel() {
  try {
    env.allowRemoteModels = true;
    env.allowLocalModels = false;
    env.useBrowserCache  = false;
    // env.localModelPath = "/models";
    generator = await pipeline("text-generation", modelId, {
      dtype: "q4f16",
      progress_callback: (progressInfo) => {
        postMessage({ type: "progress", progressInfo });
      },
    });
    isInitialized = true;
    postMessage({ type: "status", status: "ready" });
  } catch (error) {
    console.error("Error initializing Hugging Face model:", error);
    postMessage({ type: "status", status: "error", error });
  }
}

async function generateResponse(conversationHistory: ChatMessage[]) {
  if (!isInitialized) {
    postMessage({ type: "error", message: "Model not initialized" });
    return;
  }
  
  try {
    const output = await generator(conversationHistory, {
      max_new_tokens: 512,
      streamer: new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => {
          postMessage({ type: "partial_response", partial_response: text });
        },
      }),
    });
    
    const response = output[0].generated_text.at(-1).content;
    postMessage({ type: "response", response: response });
  } catch (error) {
    console.error("Error generating response from Hugging Face model:", error);
    postMessage({ type: "error", message: "Error generating response", error });
  }
}

onmessage = async (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case "generate":
      await generateResponse(payload.conversationHistory);
      break;
    case "initialize":
      await initializeModel();
      break;
    default:
      console.error("Unknown message type:", type);
  }
};
