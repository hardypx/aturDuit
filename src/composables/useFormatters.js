export function useFormatters() {
  function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID')
  }

  function formatTanggal(str) {
    const d = new Date(str)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function getBulanTahun(str) {
    const d = new Date(str)
    return {
      bulan: d.getMonth(),
      tahun: d.getFullYear(),
      label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }
  }

  return { formatRupiah, formatTanggal, getBulanTahun }
}
