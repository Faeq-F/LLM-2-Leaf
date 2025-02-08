
<script lang="ts" setup>

import { ref, watch } from 'vue'
import LeafIcon from '@/components/LeafIcon.vue'
import TreeIcon from '@/components/TreeIcon.vue'
import HomeIcon from '@/components/HomeIcon.vue'
import CloudIcon from '@/components/CloudIcon.vue'
import SettingsIcon from '@/components/SettingsIcon.vue'

import type { Ref } from 'vue'

const isModalOpen = ref(false) // Controls the CO₂ stats popover
const isDonationModalOpen = ref(false) // Controls the donation modal

const amount = ref(0);
function onChangeAmount(e) {
  let val = parseFloat(e.target.value)
  if (val >= 0) {
    amount.value = val
  }
}

fetch('http://localhost:5038/api/get/collection/' + 'Users').then((response) => {
  console.log(response)
});

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
    <div class="flex flex-row gap-10">
      <div class="w-full max-w-[18rem]">
        <aside class="sidebar h-full sidebar-fixed-left justify-start">
          <section class="sidebar-title items-center p-4">

            <RouterLink to="/">
              <button
                class="flex items-center gap-2 text-gray hover:underline border transition-all px-3 py-2 rounded bg-transparent hover:bg-gray-100/[.1]">
                <HomeIcon /><span class=" ">Home</span>
              </button>
            </RouterLink>

          </section>
          <section class="sidebar-content h-fit min-h-[20rem] overflow-visible">
            <nav class="menu rounded-md">
              <section class="menu-section px-4">
                <span class="menu-title">Your chats;</span>
                <ul class="menu-items">
                  <li class="menu-item transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Chat 1 name</span>

                  </li>
                </ul>
              </section>
            </nav>
          </section>
          <section class="sidebar-footer h-full justify-end bg-gray-2 pt-2">
            <div class="divider my-0"></div>
            <div class=" z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4">
              <label
                class="whites mx-2 flex h-fit w-full cursor-pointer p-0 hover:bg-gray-4"
                tabindex="0">
                <div class="flex flex-row gap-4 p-4">
                  <div :class="[
                    'shrink-0 size-[38px] rounded-full flex items-center justify-center',
                    'bg-gray-600'
                  ]">
                    <span class="text-white">
                      FF
                    </span>
                  </div>

                  <div class="flex flex-col">
                    <span>Faeq Faisal</span>
                    <span
                      class="text-xs font-normal text-content2">faeqfaisal@hotmail.co.uk</span>
                  </div>

                  <label class="btn bg-transparent" for="modal-1">
                    <SettingsIcon />
                  </label>
                  <input class="modal-state" id="modal-1" type="checkbox" />
                  <div class="modal w-screen">
                    <label class="modal-overlay" for="modal-1"></label>
                    <div class="modal-content flex flex-col gap-5">
                      <label for="modal-1"
                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                      <h2 class="text-xl">Settings</h2>
                      <input class="input-rounded input w-full"
                        placeholder="Hugging Face token..." v-model="token" />
                    </div>
                  </div>


                </div>
              </label>

            </div>
          </section>
        </aside>
      </div>
      <div class="flex flex-col p-4 w-full">
        <div class="w-fit">
          <label for="sidebar-mobile-fixed" class="btn btn-primary sm:hidden">Open
            Sidebar</label>
        </div>

        <div class="relative h-screen flex flex-col">

          <!-- Floating Button and CO₂ Stats Popover -->
          <div class="absolute top-4 right-4">

            <!-- Floating CO₂ stats Button -->
            <div class="popover">
              <label
                class="popover-trigger flex items-center gap-2 bg-green-600 text-white px-3 py-2  btn hover:bg-green-700 shadow"
                tabindex="0">
                <LeafIcon />
                <span>My CO₂ Emissions</span>
              </label>
              <!-- CO₂ Stats Popover Modal -->
              <div class="popover-content popover-bottom-left bg-gray-100"
                tabindex="0">
                <div class="popover-arrow"></div>
                <div class="">
                  <!-- Header -->
                  <div class="text-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                      CO₂
                      Statistics</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      visualisations</p>
                  </div>
                  <!-- Visualisations -->
                  <div class="grid gap-4">
                    <!-- Metric 1: CO₂ used in this session -->
                    <div
                      class="flex items-center p-4 border rounded-lg shadow bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="w-8 h-8 text-green-600" fill="none"
                        stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"
                        viewBox="0 0 24 24">
                        <path
                          d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path
                          d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                      <div class="ml-4">
                        <div
                          class="text-xl font-bold text-gray-800 dark:text-white">
                          2.5
                          kg</div>
                        <div class="text-sm text-gray-500">CO₂ used in this
                          session
                        </div>
                      </div>
                    </div>
                    <!-- Metric 2: CO₂ used from this model -->
                    <div
                      class="flex items-center p-4 border rounded-lg shadow bg-white">
                      <CloudIcon />
                      <div class="ml-4">
                        <div
                          class="text-xl font-bold text-gray-800 dark:text-white">
                          1.2
                          kg</div>
                        <div class="text-sm text-gray-500">CO₂ used from this
                          model per query
                        </div>
                      </div>
                    </div>
                    <!-- Metric 3: Suggested trees to plant -->
                    <div
                      class="flex items-center p-4 border rounded-lg shadow bg-white">
                      <div class="-ml-[5px]">
                        <TreeIcon />
                      </div>
                      <div class="ml-[0.6rem]">
                        <div
                          class="text-xl font-bold text-gray-800 dark:text-white">
                          3
                          Trees</div>
                        <div class="text-sm text-gray-500">Suggested trees to
                          plant
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Plant Now Button -->
                  <div class="mt-6 flex justify-center">
                    <button @click="handlePlantNow"
                      class="bg-green-600 text-white px-4 py-2 btn hover:bg-green-700">
                      Plant Now
                    </button>
                  </div>
                </div>
              </div>
            </div>



          </div>

          <!-- Donation Modal (Tree-Themed) -->
          <transition name="fade">
            <div v-if="isDonationModalOpen"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
              <div
                class="bg-green-50 dark:bg-green-900 rounded-lg shadow-lg p-6 w-[40vw] relative border border-green-200 dark:border-green-700">
                <!-- Close Button -->
                <button @click="isDonationModalOpen = false"
                  class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold">
                  &times;
                </button>
                <!-- Tree Icon -->
                <div class="w-[56px]" style="margin: 0 auto;">
                  <TreeIcon />
                </div>

                <h2
                  class="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                  Support the Cause
                </h2>
                <p class="mb-14 text-gray-600 dark:text-gray-300 text-center">
                  Your donation will help us plant more trees and offset CO₂
                  emissions.
                </p>
                <div class="mb-4">
                  <label for="donationAmount"
                    class="block text-gray-800 dark:text-white mb-4">
                    Donation Amount ($)
                  </label>


                  <input type="number" id="donationAmount" :value="amount"
                    @input="onChangeAmount" class=" px-3 py-2 input-block input"
                    placeholder="Enter amount" />

                </div>
                <div class="mb-4">
                  <label for="donorName"
                    class="block text-gray-800 dark:text-white mb-4">
                    Name
                  </label>
                  <input type="text" id="donorName"
                    class=" px-3 py-2 input-block input"
                    placeholder="Your Name" />

                </div>
                <div class="mb-4">
                  <label for="donorEmail"
                    class="block text-gray-800 dark:text-white mb-4">
                    Email
                  </label>
                  <input type="email" id="donorEmail"
                    class=" px-3 py-2 input-block input"
                    placeholder="Your Email" />


                </div>
                <button
                  class="bg-blue-600 text-white px-4 py-2 mt-4 btn hover:bg-blue-700 w-full">
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
                  <span
                    class="text-xl font-bold text-gray-800 dark:text-white">LLM 2
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
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </label>
                        <div
                          class="popover-content popover-top-center w-36 m-0 items-center"
                          tabindex="0">
                          <div class="popover-arrow"></div>
                          <div
                            class="btn-group btn-group-vertical btn-group-scrollable">
                            <button @click="() => selectedModel = model"
                              class="btn w-full max-w-full p-0 m-0"
                              v-for="model in models" :key="model.name">{{
                                model.name
                              }}</button>
                          </div>
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
