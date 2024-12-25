<template>
  <div v-if="title" class="bg-[#3B2A2A] rounded-lg p-4">
    <a :href="link" target="_blank" class="block text-xl text-[#DFDFDF] font-bold hover:underline">
      {{ title }}
    </a>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  link: String
})
</script>