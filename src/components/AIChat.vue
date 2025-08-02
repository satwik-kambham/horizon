<template>
  <div
    class="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-lg max-h-[80vh] overflow-hidden"
  >
    <h2 class="text-2xl font-bold mb-4">AI Chat</h2>
    <div class="mb-4">
      <div
        v-if="backendStatus === 'initializing'"
        class="p-2 bg-yellow-100 text-yellow-800 rounded"
      >
        <span class="font-semibold">Initializing:</span> Backend is loading,
        please wait...
      </div>
      <div
        v-else-if="backendStatus === 'error'"
        class="p-2 bg-red-100 text-red-800 rounded"
      >
        <span class="font-semibold">Error:</span> Backend initialization failed.
        Please check the console for errors.
      </div>
      <div v-else class="p-2 bg-green-100 text-green-800 rounded">
        <span class="font-semibold">Ready:</span> Backend is ready
      </div>
    </div>
    <div
      class="chat-history mb-4 h-64 overflow-y-auto border p-2 rounded flex flex-col gap-2"
    >
      <div
        v-for="(message, index) in conversationHistory"
        :key="index"
        :class="[
          'p-2 rounded mb-2',
          message.role === 'user'
            ? 'bg-blue-100 ml-auto max-w-xs'
            : 'bg-gray-100',
        ]"
      >
        <div class="font-bold">{{ message.role }}:</div>
        <div>{{ message.content }}</div>
      </div>
    </div>
    <div class="flex">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none"
        placeholder="Type your message here..."
      />
      <button
        @click="sendMessage"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
    <button
      @click="clearConversation"
      class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
    >
      Clear Conversation
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { aiChatService } from "../services/ai/AIChatService";

const newMessage = ref("");
const conversationHistory = aiChatService.getConversationHistory();
const backendStatus = ref<"ready" | "initializing" | "error">("initializing");

// Update status from backend
onMounted(() => {
  backendStatus.value = aiChatService.currentBackend.getBackendStatus();
});

// Watch for status changes
watch(
  () => aiChatService.currentBackend.getBackendStatus(),
  (newStatus) => {
    backendStatus.value = newStatus;
  },
);

// Poll for status updates every 2 seconds
setInterval(() => {
  backendStatus.value = aiChatService.currentBackend.getBackendStatus();
}, 2000);

const sendMessage = async () => {
  if (newMessage.value.trim() === "") return;

  if (backendStatus.value !== "ready") {
    alert(
      "Backend is not ready yet. Please wait for initialization to complete.",
    );
    return;
  }

  try {
    const response = await aiChatService.sendMessage(newMessage.value);
    conversationHistory.value = aiChatService.getConversationHistory();
    newMessage.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const clearConversation = () => {
  aiChatService.clearConversation();
  conversationHistory.value = [];
};
</script>
