<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Rekap Bulanan</h1>
        <p class="text-slate-500 mt-1">Ringkasan per periode</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportExcel" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
          <i class="fas fa-file-excel"></i> Export Excel
        </button>
        <button @click="exportPDF" class="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">
          <i class="fas fa-file-pdf"></i> Export PDF
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Periode</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Pemasukan</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Pengeluaran</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Netto</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in store.rekapPeriods" :key="p.label" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ p.label }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-income-600 text-right">{{ formatRupiah(p.income) }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-expense-600 text-right">{{ formatRupiah(p.expense) }}</td>
              <td
                class="px-6 py-4 text-sm font-bold text-right"
                :class="p.income - p.expense >= 0 ? 'text-income-600' : 'text-expense-600'"
              >
                {{ formatRupiah(p.income - p.expense) }}
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="statusClass(p.income - p.expense)"
                >
                  {{ statusLabel(p.income - p.expense) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="store.rekapPeriods.length === 0" message="Belum ada data rekap" icon="fas fa-calendar-times" />
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../stores/finance'
import { useFormatters } from '../composables/useFormatters'
import { useToast } from '../composables/useToast'
import EmptyState from '../components/EmptyState.vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const store = useFinanceStore()
const { formatRupiah } = useFormatters()
const { showToast } = useToast()

function statusClass(netto) {
  if (netto > 0) return 'bg-income-100 text-income-600'
  if (netto < 0) return 'bg-expense-100 text-expense-600'
  return 'bg-slate-100 text-slate-600'
}

function statusLabel(netto) {
  if (netto > 0) return 'Surplus'
  if (netto < 0) return 'Defisit'
  return 'Break Even'
}

function exportExcel() {
  if (store.rekapPeriods.length === 0) return showToast('Belum ada data untuk di-export')
  
  // Sheet 1: Rekap Bulanan
  const rekapData = store.rekapPeriods.map(p => ({
    'Periode': p.label,
    'Pemasukan': p.income,
    'Pengeluaran': p.expense,
    'Netto': p.income - p.expense,
    'Status': statusLabel(p.income - p.expense)
  }))

  const wsRekap = XLSX.utils.json_to_sheet(rekapData)
  wsRekap['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]

  // Sheet 2: Rincian Transaksi (Buku Besar)
  const sortedTx = [...store.transaksi].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  let saldo = 0
  const txData = sortedTx.map(t => {
    if (t.tipe === 'Pemasukan') saldo += t.jumlah
    else saldo -= t.jumlah
    return {
      'Tanggal': new Date(t.tanggal).toLocaleDateString('id-ID'),
      'Deskripsi': t.deskripsi,
      'Kategori': t.kategori,
      'Metode': t.metode,
      'Debit': t.tipe === 'Pemasukan' ? t.jumlah : 0,
      'Kredit': t.tipe === 'Pengeluaran' ? t.jumlah : 0,
      'Saldo': saldo
    }
  })

  const wsTx = XLSX.utils.json_to_sheet(txData)
  wsTx['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, wsRekap, "Rekap Bulanan")
  XLSX.utils.book_append_sheet(wb, wsTx, "Rincian Transaksi")
  
  XLSX.writeFile(wb, "Laporan_Keuangan_Detail.xlsx")
  showToast('Berhasil export Laporan ke Excel')
}

function exportPDF() {
  if (store.rekapPeriods.length === 0) return showToast('Belum ada data untuk di-export')

  const doc = new jsPDF()
  
  // Header Laporan
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text('Laporan Keuangan Profesional', 14, 22)
  
  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139) // slate-500
  doc.text('Aplikasi PixelStudio', 14, 30)
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 36)

  // Tabel Rekapitulasi
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text('1. Ringkasan Periode Bulanan', 14, 48)

  const rekapColumn = ["Periode", "Pemasukan", "Pengeluaran", "Netto", "Status"]
  const rekapRows = store.rekapPeriods.map(p => {
    const netto = p.income - p.expense
    return [p.label, formatRupiah(p.income), formatRupiah(p.expense), formatRupiah(netto), statusLabel(netto)]
  })

  doc.autoTable({
    startY: 54,
    head: [rekapColumn],
    body: rekapRows,
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] }, // slate-800
    styles: { font: 'helvetica', fontSize: 10 },
    alternateRowStyles: { fillColor: [248, 250, 252] } // slate-50
  })

  // Tabel Transaksi Detail (Buku Besar)
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  const finalY = doc.lastAutoTable.finalY || 54
  doc.text('2. Rincian Transaksi (Buku Besar)', 14, finalY + 15)

  const txColumn = ["Tanggal", "Deskripsi", "Kategori", "Metode", "Debit", "Kredit", "Saldo"]
  const sortedTx = [...store.transaksi].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
  let saldo = 0
  const txRows = sortedTx.map(t => {
    if (t.tipe === 'Pemasukan') saldo += t.jumlah
    else saldo -= t.jumlah
    return [
      new Date(t.tanggal).toLocaleDateString('id-ID'),
      t.deskripsi,
      t.kategori,
      t.metode,
      t.tipe === 'Pemasukan' ? formatRupiah(t.jumlah) : '-',
      t.tipe === 'Pengeluaran' ? formatRupiah(t.jumlah) : '-',
      formatRupiah(saldo)
    ]
  })

  doc.autoTable({
    startY: finalY + 21,
    head: [txColumn],
    body: txRows,
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] },
    styles: { font: 'helvetica', fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' }
    }
  })

  doc.save("Laporan_Keuangan_Detail.pdf")
  showToast('Berhasil export Laporan ke PDF')
}
</script>
