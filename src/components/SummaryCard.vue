<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
    <div class="flex items-center justify-between mb-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center"
        :class="iconBgClass"
      >
        <i :class="[icon, iconTextClass]" class="text-lg"></i>
      </div>
      <span
        class="text-xs font-semibold px-2 py-1 rounded-full"
        :class="badgeClass"
      >
        {{ badge }}
      </span>
    </div>
    <p class="text-sm text-slate-500 mb-1">{{ label }}</p>
    <h3 class="text-2xl font-bold text-slate-900">{{ value }}</h3>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  badge: { type: String, required: true },
  iconBgClass: { type: String, default: 'bg-blue-100' },
  iconTextClass: { type: String, default: 'text-blue-600' },
  badgeClass: { type: String, default: 'text-blue-600 bg-blue-50' }
})
</script>
