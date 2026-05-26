import { createRouter, createWebHistory } from 'vue-router' // createWebHashHistory diganti menjadi createWebHistory.
import DashboardView from '../views/DashboardView.vue'
import TransaksiView from '../views/TransaksiView.vue'
import RekapView from '../views/RekapView.vue'
import AnggaranView from '../views/AnggaranView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/transaksi', name: 'transaksi', component: TransaksiView },
  { path: '/rekap', name: 'rekap', component: RekapView },
  { path: '/anggaran', name: 'anggaran', component: AnggaranView }
]

const router = createRouter({
  history: createWebHistory(), // Fungsi createWebHashHistory() diubah menjadi createWebHistory()
  routes: routes,              // routes ditambah menjadi routes: routes
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
