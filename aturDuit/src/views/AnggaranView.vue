<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Anggaran</h1>
      <p class="text-slate-500 mt-1">Kelola budget bulanan</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Total Anggaran</p>
        <h3 class="text-2xl font-bold text-slate-900">{{ formatRupiah(store.totalAnggaran) }}</h3>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Total Realisasi</p>
        <h3 class="text-2xl font-bold text-expense-600">{{ formatRupiah(store.totalRealisasi) }}</h3>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Sisa Budget</p>
        <h3 class="text-2xl font-bold text-blue-600">{{ formatRupiah(store.totalAnggaran - store.totalRealisasi) }}</h3>
      </div>
    </div>

    <!-- Budget Detail -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h3 class="text-lg font-bold text-slate-900">Detail Anggaran per Kategori</h3>
      </div>
      <div class="divide-y divide-slate-100">
        <div
          v-for="item in store.realisasiBudget"
          :key="item.kategori"
          class="p-6 hover:bg-slate-50 transition-colors group"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-slate-900">{{ item.kategori }}</h4>
                <button
                  @click="openEdit(item)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50"
                  title="Edit anggaran"
                >
                  <i class="fas fa-pencil-alt text-sm"></i>
                </button>
              </div>
              <p class="text-sm text-slate-500 mt-0.5">
                Anggaran: {{ formatRupiah(item.anggaran) }} | Realisasi: {{ formatRupiah(item.realisasi) }}
              </p>
            </div>
            <span class="text-sm font-semibold" :class="statusColor(item.persen)">
              {{ statusText(item.persen) }}
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 mb-2">
            <div
              class="h-3 rounded-full progress-bar"
              :class="barColor(item.persen)"
              :style="{ width: item.persen + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-slate-500">
            <span>{{ item.persen.toFixed(1) }}% tercapai</span>
            <span
              class="font-medium"
              :class="item.sisa >= 0 ? 'text-income-600' : 'text-expense-600'"
            >
              Sisa: {{ formatRupiah(item.sisa) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Edit Modal -->
    <BudgetModal
      :show="modalShow"
      :kategori="editKategori"
      :nominal="editNominal"
      @close="modalShow = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useFormatters } from '../composables/useFormatters'
import { useToast } from '../composables/useToast'
import BudgetModal from '../components/BudgetModal.vue'

const store = useFinanceStore()
const { formatRupiah } = useFormatters()
const { showToast } = useToast()

const modalShow = ref(false)
const editKategori = ref('')
const editNominal = ref(0)

function openEdit(item) {
  editKategori.value = item.kategori
  editNominal.value = item.anggaran
  modalShow.value = true
}

function handleSave(nominal) {
  store.updateBudget(editKategori.value, nominal)
  modalShow.value = false
  showToast(`Anggaran ${editKategori.value} diperbarui!`)
}

function barColor(persen) {
  if (persen >= 100) return 'bg-expense-500'
  if (persen > 80) return 'bg-amber-500'
  return 'bg-blue-500'
}

function statusColor(persen) {
  if (persen >= 100) return 'text-expense-600'
  if (persen > 80) return 'text-amber-600'
  return 'text-income-600'
}

function statusText(persen) {
  if (persen >= 100) return 'Over Budget'
  if (persen > 80) return 'Hati-hati'
  return 'Aman'
}
</script>
