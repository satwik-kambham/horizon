<template>
  <div class="flex flex-col h-full w-full">
    <div
      class="bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden flex flex-col h-full w-full min-h-full"
    >
      <div class="p-4 border-b border-[#333]">
        <div
          v-if="backendStatus === 'initializing'"
          class="p-2 bg-[#333] text-yellow-400 rounded"
        >
          <span class="font-semibold">Initializing:</span> Backend is loading,
          please wait...
        </div>
        <div
          v-else-if="backendStatus === 'error'"
          class="p-2 bg-[#333] text-red-400 rounded"
        >
          <span class="font-semibold">Error:</span> Backend initialization
          failed. Please check the console for errors.
        </div>
        <div v-else class="p-2 bg-[#333] text-green-400 rounded">
          <span class="font-semibold">Ready:</span> Backend is ready
        </div>
      </div>

      <div
        v-if="progress && backendStatus !== 'ready'"
        class="p-4 border-b border-[#333]"
      >
        <div class="text-sm font-medium mb-1">Loading: {{ progress.file }}</div>
        <div class="w-full bg-[#333] rounded-full h-2.5">
          <div
            class="bg-blue-500 h-2.5 rounded-full"
            :style="{ width: (progress.progress ?? 100) + '%' }"
          ></div>
        </div>
        <div class="text-sm text-[#aaa] mt-1">
          {{ Math.round(progress.progress ?? 100) }}%
        </div>
      </div>

      <div class="flex-grow overflow-hidden">
        <div
          class="chat-history h-full overflow-y-auto p-4 flex flex-col gap-2"
        >
          <div
            v-for="(message, index) in conversationHistory"
            :key="index"
            :class="[
              'p-3 rounded-lg',
              message.role === 'user'
                ? 'bg-[#2d2d2d] ml-auto max-w-xs text-right'
                : 'bg-[#252525]',
            ]"
          >
            <div class="font-bold">{{ message.role }}:</div>
            <div>{{ message.content }}</div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-[#333] flex flex-col gap-3">
        <div class="flex">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            class="flex-grow px-4 py-3 bg-[#252525] text-[#aaa] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          />
          <button
            @click="sendMessage"
            class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
        <div class="flex gap-3">
          <button
            @click="clearConversation"
            class="bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 transition-colors flex-1"
          >
            Clear
          </button>
          <button
            @click="openExtraArgsModal"
            class="bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition-colors flex-1"
          >
            Configure
          </button>
        </div>
      </div>
    </div>

    <teleport to="body">
      <ExtraArgsModal />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { aiChatService } from "../services/ai/AIChatService";
import { useSettingsStore } from "../stores/settings";
import ExtraArgsModal from "./ExtraArgsModal.vue";

const newMessage = ref("");
const conversationHistory = aiChatService.getConversationHistory();
const backendStatus = ref<"ready" | "initializing" | "error">("initializing");
const settings = useSettingsStore();

const progress = computed(() => {
  if (aiChatService.currentBackend.progress) {
    return aiChatService.currentBackend.progress.value;
  }
  return null;
});

onMounted(() => {
  backendStatus.value = aiChatService.currentBackend.getBackendStatus();
});

watch(
  () => aiChatService.currentBackend.getBackendStatus(),
  (newStatus) => {
    backendStatus.value = newStatus;
  },
);

const sendMessage = async () => {
  if (newMessage.value.trim() === "") return;

  if (backendStatus.value !== "ready") {
    alert(
      "Backend is not ready yet. Please wait for initialization to complete.",
    );
    return;
  }

  try {
    const response = await aiChatService.sendMessage(
      newMessage.value,
      settings.extraChatArgs,
    );
    newMessage.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const clearConversation = () => {
  aiChatService.clearConversation();
};

const openExtraArgsModal = () => {
  settings.isSettingsOpen = true;
};
</script>
