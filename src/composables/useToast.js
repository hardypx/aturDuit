import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
let timeout = null

export function useToast() {
  function showToast(msg) {
    message.value = msg
    visible.value = true
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      visible.value = false
    }, 2500)
  }

  return { message, visible, showToast }
}
