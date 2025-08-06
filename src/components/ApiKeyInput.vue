<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <h2 class="text-lg font-semibold mb-2">API Key Settings</h2>
    <div class="mb-2">
      <label for="apiKey" class="block text-sm font-medium mb-1">API Key</label>
      <input
        id="apiKey"
        v-model="settingsStore.extraChatArgs.apiKey"
        type="text"
        placeholder="Enter your API key"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
</script>
