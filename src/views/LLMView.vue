
<script lang="ts" setup>

import { ref, watch } from 'vue'
import LeafIcon from '@/components/LeafIcon.vue'
import HomeIcon from '@/components/HomeIcon.vue'
import SettingsIcon from '@/components/SettingsIcon.vue'

import type { Ref } from 'vue'

const isModalOpen = ref(false) // Controls the CO₂ stats popover
const isDonationModalOpen = ref(false) // Controls the donation modal

interface message {
  isAI: boolean
  content: string
  initials: string
}

// When Plant Now is clicked, close the CO₂ stats popover and open the donation modal.
const handlePlantNow = () => {
  isModalOpen.value = false
  isDonationModalOpen.value = true
}

const models = [{ name: 'ChatGPT o3-mini', model: 'Unsupported' }, { name: 'Claude 3 Opus', model: 'Unsupported' }, { name: 'DeepSeek R1', model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B' }, { name: 'Qwen 2.5', model: 'Qwen/Qwen2.5-Coder-32B-Instruct' }, { name: 'Llama 3.3', model: 'meta-llama/Llama-3.3-70B-Instruct' }]
const selectedModel = ref({ name: 'ChatGPT o3-mini', model: 'Unsupported' })

import { HfInference } from "@huggingface/inference";
const token = ref('')

const inputValue = ref('')
const loading = ref(false)
const messages: Ref<message[]> = ref([])

const handleSubmit = async () => {
  let val = inputValue.value;
  loading.value = true;
  inputValue.value = ''
  messages.value.push({
    isAI: false,
    content: val,
    initials: 'LF'
  })
  if (val.trim()) {
    const inference = new HfInference(token.value);
    await inference.chatCompletion({
      model: selectedModel.value.model,
      messages: [{ role: "user", content: val }],
      max_tokens: 512
    }).then((out) => {
      messages.value.push({
        isAI: true,
        content: out.choices[0].message.content!,
        initials: 'AI'
      })
    }).catch((e) => {
      messages.value.push({
        isAI: true,
        content: "There was an error! Please ensure your token has been saved in settings",
        initials: 'AI'
      })
    });
    loading.value = false;
  }
}

const handleKeyPress = (e: any) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

watch(token, (newToken) => {
  console.log(`new token is: ${newToken}`)
})
</script>

<template>
  <div id="CurrentSite" class="h-screen w-screen p-0 m-0 absolute left-0 top-0">

    <div class="relative h-screen flex flex-col">
      <div class="absolute top-4 left-4">
        <RouterLink to="/">

          <button
            class="flex items-center gap-2 text-gray hover:underline border transition-all px-3 py-2 rounded bg-transparent hover:bg-gray-100/[.1]">
            <HomeIcon /><span class=" ">Home</span>
          </button>
        </RouterLink>
      </div>
      <!-- Floating Button and CO₂ Stats Popover -->
      <div class="absolute top-4 right-4">

        <!-- Floating CO₂ stats Button -->
        <button @click="isModalOpen = !isModalOpen"
          class="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 shadow">
          <LeafIcon />
          <span>My CO₂ Emissions</span>
        </button>

        <!-- CO₂ Stats Popover Modal -->
        <transition name="slide">
          <div v-if="isModalOpen"
            class="absolute right-0 mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-[30vw]">
            <!-- X Close Button -->
            <button @click="isModalOpen = false"
              class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold">
              &times;
            </button>
            <!-- Header -->
            <div class="text-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">CO₂
                Statistics</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Mock
                visualisations</p>
            </div>
            <!-- Visualisations -->
            <div class="grid gap-4">
              <!-- Metric 1: CO₂ used in this session -->
              <div class="flex items-center p-4 border rounded-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24">
                  <path
                    d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <div class="ml-4">
                  <div class="text-xl font-bold text-gray-800 dark:text-white">2.5
                    kg</div>
                  <div class="text-sm text-gray-500">CO₂ used in this session
                  </div>
                </div>
              </div>
              <!-- Metric 2: CO₂ used from this model -->
              <div class="flex items-center p-4 border rounded-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24">
                  <path
                    d="M9 9H5V5h4v4zM15 9h4V5h-4v4zM15 15h4v-4h-4v4zM9 15H5v-4h4v4z" />
                </svg>
                <div class="ml-4">
                  <div class="text-xl font-bold text-gray-800 dark:text-white">1.2
                    kg</div>
                  <div class="text-sm text-gray-500">CO₂ used from this model
                  </div>
                </div>
              </div>
              <!-- Metric 3: Suggested trees to plant -->
              <div class="flex items-center p-4 border rounded-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8 text-orange-600" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2l3 7h7l-5.5 4 2 7-6-4-6 4 2-7L2 9h7l3-7z" />
                </svg>
                <div class="ml-4">
                  <div class="text-xl font-bold text-gray-800 dark:text-white">3
                    Trees</div>
                  <div class="text-sm text-gray-500">Suggested trees to plant
                  </div>
                </div>
              </div>
            </div>
            <!-- Plant Now Button -->
            <div class="mt-6 flex justify-center">
              <button @click="handlePlantNow"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Plant Now
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Donation Modal (Tree-Themed) -->
      <transition name="fade">
        <div v-if="isDonationModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            class="bg-green-50 dark:bg-green-900 rounded-lg shadow-lg p-6 w-[40vw] relative border border-green-200 dark:border-green-700">
            <!-- Close Button -->
            <button @click="isDonationModalOpen = false"
              class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold">
              &times;
            </button>
            <!-- Tree Icon -->
            <svg xmlns="http://www.w3.org/2000/svg"
              class="w-16 h-16 mx-auto text-green-600 mb-4" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 21l-3 -6" />
              <path d="M12 21l3 -6" />
              <path d="M12 3a4 4 0 0 0 -4 4h8a4 4 0 0 0 -4 -4z" />
              <path d="M12 7v14" />
            </svg>
            <h2
              class="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
              Support the Cause
            </h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300 text-center">
              Your donation will help us plant more trees and offset CO₂
              emissions.
            </p>
            <div class="mb-4">
              <label for="donationAmount"
                class="block text-gray-800 dark:text-white mb-2">
                Donation Amount ($)
              </label>
              <input type="number" id="donationAmount" placeholder="Enter amount"
                class="w-full border rounded px-3 py-2" />
            </div>
            <div class="mb-4">
              <label for="donorName"
                class="block text-gray-800 dark:text-white mb-2">
                Name
              </label>
              <input type="text" id="donorName" placeholder="Your Name"
                class="w-full border rounded px-3 py-2" />
            </div>
            <div class="mb-4">
              <label for="donorEmail"
                class="block text-gray-800 dark:text-white mb-2">
                Email
              </label>
              <input type="email" id="donorEmail" placeholder="Your Email"
                class="w-full border rounded px-3 py-2" />
            </div>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Donate Now
            </button>
          </div>
        </div>
      </transition>

      <!-- Header -->
      <div class="flex-none py-10 lg:py-14">
        <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div class="inline-block mb-4 flex-none">
            <div class="flex items-center justify-center gap-2">
              <!-- Leaf Icon -->
              <svg xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path
                  d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <span class="text-xl font-bold text-gray-800 dark:text-white">LLM 2
                Leaf</span>
            </div>
          </div>
          <h1
            class="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Welcome to LLM 2 LEAF
          </h1>
          <p class="mt-3 text-gray-600 dark:text-neutral-400">
            Use your favourite LLLM with net zero CO₂ emissions
          </p>
        </div>
      </div>

      <!-- Chat Container -->
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <ul class="space-y-5">
            <li v-for="(message, index) in messages" :key="index"
              class="max-w-4xl py-2 flex gap-x-2 sm:gap-x-4">
              <div :class="[
                'shrink-0 size-[38px] rounded-full flex items-center justify-center',
                message.isAI ? 'bg-blue-600' : 'bg-gray-600'
              ]">
                <span class="text-white">
                  {{ message.isAI ? 'AI' : message.initials }}
                </span>
              </div>
              <div class="space-y-3">
                <p class="text-sm text-gray-800 dark:text-white">
                  {{ message.content }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- Input Area -->
      <div
        class="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-neutral-900 dark:border-neutral-700">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
          <div class="relative">
            <textarea v-model="inputValue" @keypress="handleKeyPress"
              class="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              placeholder="Ask me anything..."></textarea>

            <div
              class="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-white dark:bg-neutral-900">
              <div class="flex justify-between items-center">
                <!-- Model Selector -->
                <div class="relative">
                  <div class="popover mr-2">
                    <label
                      class="popover-trigger  btn bg-transparent border w-auto"
                      tabindex="0">
                      {{ selectedModel.name }}
                      <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </label>
                    <div
                      class="popover-content popover-top-center w-28 m-0 items-center"
                      tabindex="0">
                      <div class="popover-arrow"></div>
                      <div
                        class="btn-group btn-group-vertical btn-group-scrollable">
                        <button @click="() => selectedModel = model" class="btn"
                          v-for="model in models" :key="model.name">{{ model.name
                          }}</button>
                      </div>
                    </div>
                  </div>

                  <div class="popover ">
                    <label
                      class="popover-trigger  btn bg-transparent border w-auto"
                      tabindex="0">
                      <SettingsIcon />
                    </label>
                    <div
                      class="popover-content popover-top-center w-80 items-center"
                      tabindex="0">
                      <div class="popover-arrow"></div>
                      <input class="input-rounded input w-full"
                        placeholder="Hugging Face token..." v-model="token" />
                    </div>
                  </div>
                </div>



                <!-- Send Button -->
                <button @click="handleSubmit" type="button"
                  class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500">
                  <svg class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" viewBox="0 0 16 16">
                    <path
                      d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slide transition for the CO₂ popover modal */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Fade transition for the donation modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
