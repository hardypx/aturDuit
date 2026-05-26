<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900">Edit Anggaran</h3>
            <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <input type="text" :value="kategori" readonly class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nominal Anggaran (Rp)</label>
              <input
                type="number"
                v-model.number="localNominal"
                required
                min="0"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
                ref="nominalInput"
              >
            </div>
            <div class="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
              <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <p class="text-sm text-blue-700">Perubahan anggaran akan mempengaruhi perhitungan sisa budget dan status kategori.</p>
            </div>
          </div>
          <div class="p-6 border-t border-slate-100 flex gap-3">
            <button @click="$emit('close')" class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all">Batal</button>
            <button @click="save" class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
              <i class="fas fa-save mr-2"></i>Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  kategori: String,
  nominal: Number
})

const emit = defineEmits(['close', 'save'])

const localNominal = ref(props.nominal)
const nominalInput = ref(null)

watch(() => props.show, (val) => {
  if (val) {
    localNominal.value = props.nominal
    nextTick(() => nominalInput.value?.focus())
  }
})

function save() {
  if (!localNominal.value || localNominal.value < 0) {
    alert('Masukkan nominal yang valid')
    return
  }
  emit('save', localNominal.value)
}

function handleEscape(e) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onUnmounted(() => document.removeEventListener('keydown', handleEscape))
</script>
