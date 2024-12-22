<template>
  <div class="flex items-center space-x-2 bg-[#352C2E] px-4 py-2 rounded-md w-full max-w-2xl">
    <input 
      v-model="query" 
      type="text" 
      placeholder="Enter keywords" 
      class="flex-grow bg-transparent text-[#DFDFDF] placeholder-[#6B6B6B] outline-none"
      @keyup.enter="onSearch"/>
    <button @click="onSearch" class="bg-[#256969] text-white px-4 py-2 rounded-lg hover:bg-[#297e7e] hover:rounded-xl transition-all">
      Search
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const emit = defineEmits(['search'])

const onSearch = () => {
  if (query.value.trim()) {
    emit('search', query.value)
  }
}
</script>