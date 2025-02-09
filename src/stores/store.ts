import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({})
  function setVal(val: any) {
    user.value = val
  }
  return { user, setVal }
})
