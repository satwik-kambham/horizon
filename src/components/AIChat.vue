<template>
  <div class="ai-chat-container p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">AI Chat</h2>
    <div class="chat-history mb-4 h-64 overflow-y-auto border p-2 rounded">
      <div v-for="(message, index) in conversationHistory" :key="index" 
           :class="['p-2 rounded mb-2', message.role === 'user' ? 'bg-blue-100 ml-auto max-w-xs' : 'bg-gray-100']">
        <div class="font-bold">{{ message.role }}:</div>
        <div>{{ message.content }}</div>
      </div>
    </div>
    <div class="flex">
      <input v-model="newMessage" @keyup.enter="sendMessage" 
             class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none"
             placeholder="Type your message here..." />
      <button @click="sendMessage" 
              class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
        Send
      </button>
    </div>
    <button @click="clearConversation" 
            class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
      Clear Conversation
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { aiChatService } from '../services/ai/AIChatService'

const newMessage = ref('')
const conversationHistory = ref(aiChatService.getConversationHistory())

const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;

  try {
    const response = await aiChatService.sendMessage(newMessage.value)
    conversationHistory.value = aiChatService.getConversationHistory()
    newMessage.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const clearConversation = () => {
  aiChatService.clearConversation()
  conversationHistory.value = []
}


</script>

<style scoped>
.ai-chat-container {
  max-height: 80vh;
}
.chat-history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>