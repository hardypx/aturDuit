import { createRouter, createWebHashHistory } from 'vue-router'
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
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
