<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-slate-500 mt-1">Ringkasan keuangan bulan ini</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        label="Total Pemasukan"
        :value="formatRupiah(store.currentMonthIncome)"
        icon="fas fa-arrow-down"
        badge="Pemasukan"
        icon-bg-class="bg-income-100"
        icon-text-class="text-income-600"
        badge-class="text-income-600 bg-income-50"
      />
      <SummaryCard
        label="Total Pengeluaran"
        :value="formatRupiah(store.currentMonthExpense)"
        icon="fas fa-arrow-up"
        badge="Pengeluaran"
        icon-bg-class="bg-expense-100"
        icon-text-class="text-expense-600"
        badge-class="text-expense-600 bg-expense-50"
      />
      <SummaryCard
        label="Sisa / Netto"
        :value="formatRupiah(store.netto)"
        icon="fas fa-wallet"
        :badge="store.netto >= 0 ? 'Surplus' : 'Defisit'"
        icon-bg-class="bg-blue-100"
        icon-text-class="text-blue-600"
        :badge-class="store.netto >= 0 ? 'text-income-600 bg-income-50' : 'text-expense-600 bg-expense-50'"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Komposisi Pengeluaran</h3>
        <div class="relative h-64">
          <canvas ref="pieCanvas"></canvas>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Pemasukan vs Pengeluaran</h3>
        <div class="relative h-64">
          <canvas ref="barCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900">Transaksi Terbaru</h3>
        <router-link to="/transaksi" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Lihat Semua →</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Deskripsi</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Jumlah</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="t in store.recentTransactions" :key="t.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-sm text-slate-600">{{ formatTanggal(t.tanggal) }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-lg text-xs font-medium"
                  :class="t.tipe === 'Pemasukan' ? 'bg-income-100 text-income-600' : 'bg-expense-100 text-expense-600'"
                >
                  {{ t.kategori }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-700">{{ t.deskripsi }}</td>
              <td
                class="px-6 py-4 text-sm font-semibold text-right"
                :class="t.tipe === 'Pemasukan' ? 'text-income-600' : 'text-expense-600'"
              >
                {{ t.tipe === 'Pemasukan' ? '+' : '-' }} {{ formatRupiah(t.jumlah) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useFinanceStore } from '../stores/finance'
import { useFormatters } from '../composables/useFormatters'
import SummaryCard from '../components/SummaryCard.vue'

Chart.register(...registerables)

const store = useFinanceStore()
const { formatRupiah, formatTanggal } = useFormatters()

const pieCanvas = ref(null)
const barCanvas = ref(null)
let pieChart = null
let barChart = null

function renderCharts() {
  if (!pieCanvas.value || !barCanvas.value) return

  // Pie / Doughnut Chart
  if (pieChart) pieChart.destroy()
  pieChart = new Chart(pieCanvas.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(store.expenseByKategori),
      datasets: [{
        data: Object.values(store.expenseByKategori),
        backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { usePointStyle: true, padding: 15, font: { size: 11 } } }
      },
      cutout: '65%'
    }
  })

  // Bar Chart
  if (barChart) barChart.destroy()
  barChart = new Chart(barCanvas.value, {
    type: 'bar',
    data: {
      labels: Object.keys(store.monthlyData),
      datasets: [
        { label: 'Pemasukan', data: Object.values(store.monthlyData).map(d => d.income), backgroundColor: '#22c55e', borderRadius: 6 },
        { label: 'Pengeluaran', data: Object.values(store.monthlyData).map(d => d.expense), backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { callback: v => 'Rp ' + (v / 1000000).toFixed(1) + 'M' } },
        x: { grid: { display: false } }
      }
    }
  })
}

onMounted(() => {
  renderCharts()
})

watch(() => store.transaksi, () => {
  nextTick(() => renderCharts())
}, { deep: true })
</script>
