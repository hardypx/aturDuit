import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // ==================== Default Data ====================
  const defaultData = [
    { id: 1, tanggal: '2026-01-01', kategori: 'Gaji', tipe: 'Pemasukan', deskripsi: 'Gaji Bulan Januari', jumlah: 10000000, metode: 'Transfer Bank' },
    { id: 2, tanggal: '2026-01-03', kategori: 'Freelance', tipe: 'Pemasukan', deskripsi: 'Project Website', jumlah: 2500000, metode: 'Transfer Bank' },
    { id: 3, tanggal: '2026-01-05', kategori: 'Makan', tipe: 'Pengeluaran', deskripsi: 'Makan Siang', jumlah: 50000, metode: 'Cash' },
    { id: 4, tanggal: '2026-01-06', kategori: 'Transportasi', tipe: 'Pengeluaran', deskripsi: 'Bensin Motor', jumlah: 75000, metode: 'Cash' },
    { id: 5, tanggal: '2026-01-07', kategori: 'Belanja', tipe: 'Pengeluaran', deskripsi: 'Groceries Supermarket', jumlah: 450000, metode: 'e-Wallet' },
    { id: 6, tanggal: '2026-01-08', kategori: 'Tagihan', tipe: 'Pengeluaran', deskripsi: 'Listrik Januari', jumlah: 350000, metode: 'Transfer Bank' },
    { id: 7, tanggal: '2026-01-10', kategori: 'Investasi', tipe: 'Pemasukan', deskripsi: 'Dividen Saham', jumlah: 500000, metode: 'Transfer Bank' },
    { id: 8, tanggal: '2026-01-12', kategori: 'Makan', tipe: 'Pengeluaran', deskripsi: 'Dinner', jumlah: 120000, metode: 'e-Wallet' },
    { id: 9, tanggal: '2026-01-15', kategori: 'Transportasi', tipe: 'Pengeluaran', deskripsi: 'Parkir & Tol', jumlah: 35000, metode: 'Cash' },
    { id: 10, tanggal: '2026-01-15', kategori: 'Hiburan', tipe: 'Pengeluaran', deskripsi: 'Nonton Bioskop', jumlah: 100000, metode: 'e-Wallet' },
    { id: 11, tanggal: '2026-01-18', kategori: 'Kesehatan', tipe: 'Pengeluaran', deskripsi: 'Beli Obat', jumlah: 85000, metode: 'Cash' },
    { id: 12, tanggal: '2026-01-20', kategori: 'Tabungan', tipe: 'Pengeluaran', deskripsi: 'Transfer ke Tabungan', jumlah: 2000000, metode: 'Transfer Bank' },
    { id: 13, tanggal: '2026-01-22', kategori: 'Makan', tipe: 'Pengeluaran', deskripsi: 'Makan Siang', jumlah: 45000, metode: 'Cash' },
    { id: 14, tanggal: '2026-01-25', kategori: 'Tagihan', tipe: 'Pengeluaran', deskripsi: 'Internet WiFi', jumlah: 300000, metode: 'Transfer Bank' },
    { id: 15, tanggal: '2026-01-28', kategori: 'Belanja', tipe: 'Pengeluaran', deskripsi: 'Beli Baju', jumlah: 275000, metode: 'e-Wallet' },
  ]

  const defaultBudget = {
    'Makan': 2000000,
    'Transportasi': 500000,
    'Belanja': 1500000,
    'Tagihan': 1000000,
    'Hiburan': 500000,
    'Kesehatan': 300000,
    'Tabungan': 2000000,
    'Lainnya': 500000
  }

  // ==================== State ====================
  const transaksi = ref(JSON.parse(localStorage.getItem('fintrack_data')) || [...defaultData])
  const budgetConfig = ref(JSON.parse(localStorage.getItem('fintrack_budget')) || { ...defaultBudget })

  // ==================== Auto-Save ====================
  watch(transaksi, (val) => {
    localStorage.setItem('fintrack_data', JSON.stringify(val))
  }, { deep: true })

  watch(budgetConfig, (val) => {
    localStorage.setItem('fintrack_budget', JSON.stringify(val))
  }, { deep: true })

  // ==================== Computed: Dashboard ====================
  const currentMonthIncome = computed(() => {
    const now = new Date()
    const cm = now.getMonth()
    const cy = now.getFullYear()
    return transaksi.value
      .filter(t => {
        const d = new Date(t.tanggal)
        return d.getMonth() === cm && d.getFullYear() === cy && t.tipe === 'Pemasukan'
      })
      .reduce((sum, t) => sum + t.jumlah, 0)
  })

  const currentMonthExpense = computed(() => {
    const now = new Date()
    const cm = now.getMonth()
    const cy = now.getFullYear()
    return transaksi.value
      .filter(t => {
        const d = new Date(t.tanggal)
        return d.getMonth() === cm && d.getFullYear() === cy && t.tipe === 'Pengeluaran'
      })
      .reduce((sum, t) => sum + t.jumlah, 0)
  })

  const netto = computed(() => currentMonthIncome.value - currentMonthExpense.value)

  const expenseByKategori = computed(() => {
    const result = {}
    transaksi.value
      .filter(t => t.tipe === 'Pengeluaran')
      .forEach(t => {
        result[t.kategori] = (result[t.kategori] || 0) + t.jumlah
      })
    return result
  })

  const monthlyData = computed(() => {
    const now = new Date()
    const result = {}
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const key = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      result[key] = { income: 0, expense: 0 }
    }
    transaksi.value.forEach(t => {
      const d = new Date(t.tanggal)
      const key = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      if (result[key]) {
        if (t.tipe === 'Pemasukan') result[key].income += t.jumlah
        else result[key].expense += t.jumlah
      }
    })
    return result
  })

  const recentTransactions = computed(() => {
    return [...transaksi.value]
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 5)
  })

  // ==================== Computed: Rekap ====================
  const rekapPeriods = computed(() => {
    const periods = {}
    transaksi.value.forEach(t => {
      const d = new Date(t.tanggal)
      const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      if (!periods[label]) periods[label] = { income: 0, expense: 0, label }
      if (t.tipe === 'Pemasukan') periods[label].income += t.jumlah
      else periods[label].expense += t.jumlah
    })

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return Object.values(periods).sort((a, b) => {
      const [ma, ya] = a.label.split(' ')
      const [mb, yb] = b.label.split(' ')
      if (ya !== yb) return parseInt(ya) - parseInt(yb)
      return months.indexOf(ma) - months.indexOf(mb)
    })
  })

  // ==================== Computed: Anggaran ====================
  const realisasiBudget = computed(() => {
    return Object.entries(budgetConfig.value).map(([kategori, anggaran]) => {
      const real = expenseByKategori.value[kategori] || 0
      const sisa = anggaran - real
      const persen = anggaran > 0 ? Math.min((real / anggaran) * 100, 100) : 0
      return { kategori, anggaran, realisasi: real, sisa, persen }
    })
  })

  const totalAnggaran = computed(() =>
    Object.values(budgetConfig.value).reduce((s, v) => s + v, 0)
  )

  const totalRealisasi = computed(() =>
    realisasiBudget.value.reduce((s, b) => s + b.realisasi, 0)
  )

  // ==================== Computed: Transaksi Filters ====================
  const availableMonths = computed(() => {
    return [...new Set(transaksi.value.map(t => {
      const d = new Date(t.tanggal)
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }))].sort()
  })

  // ==================== Actions ====================
  function addTransaction(tx) {
    transaksi.value.push({ ...tx, id: Date.now() })
  }

  function deleteTransaction(id) {
    transaksi.value = transaksi.value.filter(t => t.id !== id)
  }

  function updateBudget(kategori, nominal) {
    budgetConfig.value[kategori] = nominal
  }

  return {
    transaksi,
    budgetConfig,
    currentMonthIncome,
    currentMonthExpense,
    netto,
    expenseByKategori,
    monthlyData,
    recentTransactions,
    rekapPeriods,
    realisasiBudget,
    totalAnggaran,
    totalRealisasi,
    availableMonths,
    addTransaction,
    deleteTransaction,
    updateBudget
  }
})
