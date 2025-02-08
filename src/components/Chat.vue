<script lang="ts" setup>
import { useTranslator } from '@volverjs/ai/vue'
import { ref, watch } from 'vue'

const text = ref('')
const { translate } = useTranslator()
const {
  // Ref<string>
  // the partial translation and the final result
  result,
  // Ref<{file: string, progress: number}[]>
  // the download progress of the model
  progress,
  // Ref<Error | undefined>
  // the error object if an error occurs
  error,
  // Ref<boolean>
  // is true when an error occurs
  isError,
  // Ref<boolean>
  // is true when the model is downloading
  isLoading,
  // Ref<boolean>
  // is true when the model is ready
  isReady,
  // Promise<string>
  // the promise that resolves when the translation is completed
  promise,
  // (text?: string) => Promise<string | undefined>
  // manually execute the translation
  execute
} = translate(
  // Ref<string> | string | undefined
  // the text to translate
  text,
  {
    // the source language
    from: 'eng_Latn',
    // the target language
    to: 'ita_Latn',
    // boolean (default: true)
    // set to false to disable the first translation execution
    immediate: true,
    // number (default: 500)
    // the debounce time in milliseconds to wait before executing the translation
    debounce: 800
  }
)
</script>

<template>
  hello
  <input v-model="text" type="text" name="from">
  <p>{{ result }}</p>
</template>
