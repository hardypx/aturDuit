<template>
  <nav class="glass sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i class="fas fa-wallet text-lg"></i>
          </div>
          <span class="font-bold text-xl text-slate-900 tracking-tight">FinTrack</span>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-item px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            exact-active-class="active"
          >
            <i :class="item.icon" class="mr-2"></i>{{ item.label }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t border-slate-200">
      <div class="px-4 py-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="w-full block text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          @click="mobileMenuOpen = false"
        >
          <i :class="item.icon" class="mr-3 w-5"></i>{{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navItems = [
  { to: '/', icon: 'fas fa-chart-pie', label: 'Dashboard' },
  { to: '/transaksi', icon: 'fas fa-list-alt', label: 'Transaksi' },
  { to: '/rekap', icon: 'fas fa-calendar-alt', label: 'Rekap Bulanan' },
  { to: '/anggaran', icon: 'fas fa-bullseye', label: 'Anggaran' }
]
</script>
