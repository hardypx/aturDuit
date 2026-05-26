<template>
  <div
    id="toast"
    class="fixed bottom-6 right-6 z-50 transition-all duration-300"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'"
  >
    <div class="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
      <i class="fas fa-check-circle text-green-400"></i>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { message, visible } = useToast()
</script>
