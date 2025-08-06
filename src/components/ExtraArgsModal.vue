<template>
  <div
    v-if="settings.isSettingsOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
  >
    <div class="bg-[#1f1f1f] rounded-lg w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4 text-white">Extra Arguments</h2>
      <div class="mb-4">
        <label for="modelName" class="block text-sm font-medium text-gray-400"
          >Model Name</label
        >
        <input
          id="modelName"
          v-model="settings.extraChatArgs.modelName"
          type="text"
          class="mt-1 block w-full bg-[#252525] text-white border border-[#333] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter model name"
        />
      </div>
      <div class="mb-4">
        <label for="apiUrl" class="block text-sm font-medium text-gray-400"
          >API URL</label
        >
        <input
          id="apiUrl"
          v-model="settings.extraChatArgs.apiUrl"
          type="text"
          class="mt-1 block w-full bg-[#252525] text-white border border-[#333] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter API URL"
        />
      </div>
      <div class="mb-4">
        <label for="temperature" class="block text-sm font-medium text-gray-400"
          >Temperature</label
        >
        <input
          id="temperature"
          v-model.number="settings.extraChatArgs.temperature"
          type="number"
          step="0.1"
          min="0"
          max="1"
          class="mt-1 block w-full bg-[#252525] text-white border border-[#333] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter temperature (0.0-1.0)"
        />
      </div>
      <div class="mb-4">
        <label for="seed" class="block text-sm font-medium text-gray-400"
          >Seed</label
        >
        <input
          id="seed"
          v-model.number="settings.extraChatArgs.seed"
          type="number"
          class="mt-1 block w-full bg-[#252525] text-white border border-[#333] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter seed value"
        />
      </div>
      <div class="mb-4">
        <label for="apiKey" class="block text-sm font-medium text-gray-400"
          >API Key (optional)</label
        >
        <input
          id="apiKey"
          v-model="settings.extraChatArgs.apiKey"
          type="text"
          class="mt-1 block w-full bg-[#252525] text-white border border-[#333] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter API key (optional)"
        />
      </div>

      <button
        @click="closeModal"
        class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "../stores/settings";

const settings = useSettingsStore();

const closeModal = () => {
  settings.isSettingsOpen = false;
};
</script>
