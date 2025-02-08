import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

interface message {
  isAI: boolean
  content: string
  initials: string
}

export const useMessagesStore = defineStore('messages', () => {
  const messages: Ref<message[]> = ref([])
  function push(val: message) {
    messages.value.push(val)
  }

  return { messages, push }
})
