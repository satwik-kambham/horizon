<script setup lang="ts">
import AIChat from "./components/AIChat.vue";
import ApiKeyInput from "./components/ApiKeyInput.vue";
</script>

<template>
  <main class="p-4">
    <ApiKeyInput class="mb-4" />
    <AIChat />
  </main>
</template>
