import { defineStore } from "pinia";
import { ref } from "vue";
import { ExtraChatArgs } from "../services/ai/AIChatBackend";

export const useSettingsStore = defineStore("settings", () => {
  const extraChatArgs = ref<ExtraChatArgs>({
    modelName: "Gemma-3-1B-It",
    apiUrl: "http://localhost:8080/v1/chat/completions",
    temperature: 0.7,
    seed: 42,
  });

  return {
    extraChatArgs,
  };
});
