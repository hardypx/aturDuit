<template>
  <div class="text-slate-800 min-h-screen flex flex-col justify-between">
    <div>
      <AppNav />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-in" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <footer class="w-full text-center py-6 border-t border-slate-200 bg-slate-50/50 mt-auto">
      <p class="text-sm text-slate-500 font-medium">
        &copy; 2026 AturDuit. All rights reserved.
      </p>
      <p class="text-xs text-slate-400 mt-1">
        Built with Vue & Vite • Clean URL Mode
      </p>
    </footer>

    <ToastNotification />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>
