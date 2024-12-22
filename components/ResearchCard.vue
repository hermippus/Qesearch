<template>
  <div v-if="title && description" class="bg-[#3B2A2A] rounded-lg p-4">
    <a :href="link" target="_blank" class="block text-xl text-[#DFDFDF] font-bold hover:underline">
      {{ title }}
    </a>
    <p v-if="description" class="text-[#DFDFDF] mt-2 truncate">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  link: String
})
</script>