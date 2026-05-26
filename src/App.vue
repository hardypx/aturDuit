<template>
  <div class="text-slate-800 min-h-screen flex flex-col">
    
    <AppNav />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView v-slot="{ Component }">
        <Transition name="slide-in" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-6">
      <div class="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs tracking-wide text-slate-400">
        <div class="flex items-center gap-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AturDuit &copy; 2026</span>
        </div>
        <div class="flex items-center gap-3 font-mono opacity-80">
          <span>Vue.Js. & Vite</span>
          <span class="text-slate-200">|</span>
          <span>pixelStudio</span>
        </div>
      </div>
    </footer>

    <ToastNotification />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>
