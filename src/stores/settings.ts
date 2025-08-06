import { defineStore } from "pinia";
import { ref } from "vue";
import { ExtraChatArgs } from "../services/ai/AIChatBackend";

export const useSettingsStore = defineStore("settings", () => {
  const extraChatArgs = ref<ExtraChatArgs>({
    modelName: "google/gemma-3n-e2b-it:free",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    temperature: 0.7,
    seed: 42,
    apiKey: "",
  });
  const isSettingsOpen = false;

  return {
    extraChatArgs,
    isSettingsOpen,
  };
});
