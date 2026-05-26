<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Transaksi</h1>
      <p class="text-slate-500 mt-1">Kelola pemasukan dan pengeluaran</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form Input -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
          <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i class="fas fa-plus-circle text-blue-600"></i> Tambah Transaksi
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                <input type="date" v-model="form.tanggal" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
                <select v-model="form.tipe" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white">
                  <option value="">Pilih Tipe</option>
                  <option value="Pemasukan">Pemasukan</option>
                  <option value="Pengeluaran">Pengeluaran</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select v-model="form.kategori" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white">
                  <option value="">Pilih Kategori</option>
                  <option v-for="kat in kategoriOptions" :key="kat" :value="kat">{{ kat }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <input type="text" v-model="form.deskripsi" required placeholder="Contoh: Gaji Januari" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
                <input type="number" v-model.number="form.jumlah" required min="1" placeholder="0" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Metode</label>
                <select v-model="form.metode" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white">
                  <option value="">Pilih Metode</option>
                  <option value="Cash">Cash</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="e-Wallet">e-Wallet</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                </select>
              </div>
              <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all">
                <i class="fas fa-save mr-2"></i>Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Table -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900">Daftar Transaksi</h3>
            <div class="flex flex-wrap gap-2 items-center">
              <button @click="exportExcel" class="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
                <i class="fas fa-file-excel"></i> Excel
              </button>
              <button @click="exportPDF" class="px-3 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm">
                <i class="fas fa-file-pdf"></i> PDF
              </button>
              <div class="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
              <select v-model="filterTipe" class="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white shadow-sm">
                <option value="">Semua Tipe</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
              <select v-model="filterBulan" class="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white shadow-sm">
                <option value="">Semua Bulan</option>
                <option v-for="m in store.availableMonths" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div v-if="filteredData.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">No</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tipe</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Deskripsi</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Jumlah</th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(t, i) in filteredData" :key="t.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 text-sm text-slate-500">{{ i + 1 }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ formatTanggal(t.tanggal) }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{{ t.kategori }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 rounded-lg text-xs font-medium"
                      :class="t.tipe === 'Pemasukan' ? 'bg-income-100 text-income-600' : 'bg-expense-100 text-expense-600'"
                    >
                      {{ t.tipe }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700">{{ t.deskripsi }}</td>
                  <td
                    class="px-6 py-4 text-sm font-semibold text-right"
                    :class="t.tipe === 'Pemasukan' ? 'text-income-600' : 'text-expense-600'"
                  >
                    {{ formatRupiah(t.jumlah) }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button @click="handleDelete(t.id)" class="text-expense-500 hover:text-expense-700 transition-colors p-2 rounded-lg hover:bg-expense-50">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <EmptyState v-else message="Belum ada transaksi" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useFormatters } from '../composables/useFormatters'
import { useToast } from '../composables/useToast'
import EmptyState from '../components/EmptyState.vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const store = useFinanceStore()
const { formatRupiah, formatTanggal } = useFormatters()
const { showToast } = useToast()

const kategoriOptions = ['Gaji', 'Freelance', 'Investasi', 'Makan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Tabungan', 'Lainnya']

const form = ref({
  tanggal: new Date().toISOString().split('T')[0],
  tipe: '',
  kategori: '',
  deskripsi: '',
  jumlah: '',
  metode: ''
})

const filterTipe = ref('')
const filterBulan = ref('')

const filteredData = computed(() => {
  let data = [...store.transaksi].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  if (filterTipe.value) {
    data = data.filter(t => t.tipe === filterTipe.value)
  }
  if (filterBulan.value) {
    data = data.filter(t => {
      const d = new Date(t.tanggal)
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) === filterBulan.value
    })
  }
  return data
})

function handleSubmit() {
  store.addTransaction({
    tanggal: form.value.tanggal,
    kategori: form.value.kategori,
    tipe: form.value.tipe,
    deskripsi: form.value.deskripsi,
    jumlah: form.value.jumlah,
    metode: form.value.metode
  })
  // Reset form
  form.value = {
    tanggal: new Date().toISOString().split('T')[0],
    tipe: '',
    kategori: '',
    deskripsi: '',
    jumlah: '',
    metode: ''
  }
  showToast('Transaksi berhasil ditambahkan!')
}

function handleDelete(id) {
  if (confirm('Hapus transaksi ini?')) {
    store.deleteTransaction(id)
    showToast('Transaksi dihapus')
  }
}

function getAccountingData() {
  // Urutkan dari terlama ke terbaru untuk menghitung saldo berjalan dengan benar
  const sortedData = [...filteredData.value].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  let saldo = 0
  
  return sortedData.map(t => {
    if (t.tipe === 'Pemasukan') saldo += t.jumlah
    else saldo -= t.jumlah

    return {
      Tanggal: formatTanggal(t.tanggal),
      Deskripsi: t.deskripsi,
      Kategori: t.kategori,
      Metode: t.metode,
      Debit: t.tipe === 'Pemasukan' ? t.jumlah : 0,
      Kredit: t.tipe === 'Pengeluaran' ? t.jumlah : 0,
      Saldo: saldo
    }
  })
}

function exportExcel() {
  if (filteredData.value.length === 0) return showToast('Belum ada data untuk di-export')
  
  const reportData = getAccountingData()
  
  const ws = XLSX.utils.json_to_sheet(reportData)
  // Menyesuaikan lebar kolom
  ws['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Buku Besar")
  
  const filename = filterBulan.value ? `Laporan_Transaksi_${filterBulan.value.replace(' ', '_')}.xlsx` : 'Laporan_Transaksi.xlsx'
  XLSX.writeFile(wb, filename)
  showToast('Berhasil export Laporan ke Excel')
}

function exportPDF() {
  if (filteredData.value.length === 0) return showToast('Belum ada data untuk di-export')

  const reportData = getAccountingData()
  const doc = new jsPDF('landscape')
  
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42)
  doc.text('Laporan Transaksi (Buku Besar)', 14, 22)
  
  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139)
  doc.text(filterBulan.value ? `Periode: ${filterBulan.value}` : 'Periode: Semua Waktu', 14, 30)
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 36)

  const head = [['Tanggal', 'Deskripsi', 'Kategori', 'Metode', 'Debit', 'Kredit', 'Saldo']]
  const body = reportData.map(r => [
    r.Tanggal, 
    r.Deskripsi, 
    r.Kategori, 
    r.Metode, 
    r.Debit > 0 ? formatRupiah(r.Debit) : '-', 
    r.Kredit > 0 ? formatRupiah(r.Kredit) : '-', 
    formatRupiah(r.Saldo)
  ])

  doc.autoTable({
    startY: 45,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] },
    styles: { font: 'helvetica', fontSize: 10 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' }
    }
  })

  const filename = filterBulan.value ? `Laporan_Transaksi_${filterBulan.value.replace(' ', '_')}.pdf` : 'Laporan_Transaksi.pdf'
  doc.save(filename)
  showToast('Berhasil export Laporan ke PDF')
}
</script>
