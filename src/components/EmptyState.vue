<template>
  <div class="p-12 text-center">
    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <i :class="icon" class="text-slate-400 text-2xl"></i>
    </div>
    <p class="text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Belum ada data'
  },
  icon: {
    type: String,
    default: 'fas fa-inbox'
  }
})
</script>
