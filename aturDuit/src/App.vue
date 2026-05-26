<template>
  <div class="text-slate-800">
    <AppNav />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView v-slot="{ Component }">
        <Transition name="slide-in" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <ToastNotification />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import ToastNotification from './components/ToastNotification.vue'
</script>
