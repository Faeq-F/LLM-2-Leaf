<script lang="ts" setup>

import { ref, watch, computed } from 'vue'
import LeafIcon from '@/components/LeafIcon.vue'
import TreeIcon from '@/components/TreeIcon.vue'
import HomeIcon from '@/components/HomeIcon.vue'
import CloudIcon from '@/components/CloudIcon.vue'
import ChatIcon from '@/components/ChatIcon.vue'
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

const donateLoading = ref(false)
const donateData = ref({})

const pledge = async (name, email, amount): Promise<any> => {
  donateLoading.value = true;
  const formdata = new FormData()
  formdata.append('name', name)
  formdata.append('email', email)
  formdata.append('email', amount)

  var response = await fetch('http://localhost:5038/api/pledge', {
    method: 'POST',
    body: formdata
  })
  var body = await response.json();
  donateLoading.value = false;
  donateData.value = body
};


interface message {
  isAI: boolean
  content: string
  initials: string
}

const impactOfferings = [{ name: 'Plant mangrove trees in Africa', id: 'io_01J4RSBX6KPQ4RYCRZ8C4QWRHF', divisor: 1 }, { name: 'Recover ocean-bound plastic globally', id: 'io_01J4RSBX6QX3K9HYX1Z67DSS1Y', divisor: 1000 }, { name: 'Restore coral reefs in the Maldives', id: 'io_01J4RSBX6F6CT7J4JZS14NVQWV', divisor: 25 },]
const selectedOffering = ref({ name: 'Plant mangrove trees in Africa', id: 'io_01J4RSBX6KPQ4RYCRZ8C4QWRHF', divisor: 1 })

// When Plant Now is clicked, close the CO₂ stats popover and open the donation modal.
const handlePlantNow = () => {
  isModalOpen.value = false
  isDonationModalOpen.value = true
  amount.value = parseFloat(recommendedAmount.value)
}

const models = [
  { name: 'ChatGPT o3-mini', model: 'Unsupported', co2PerQuery: 0.552 },
  { name: 'Claude 3 Opus', model: 'Unsupported', co2PerQuery: 0.125 },
  { name: 'DeepSeek R1', model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', co2PerQuery: 0.089 },
  { name: 'Qwen 2.5', model: 'Qwen/Qwen2.5-Coder-32B-Instruct', co2PerQuery: 0.231 },
  { name: 'Llama 3.3', model: 'meta-llama/Llama-3.3-70B-Instruct', co2PerQuery: 0.478 }
]

const selectedModel = ref(models[0])

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
    initials: 'FF'
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
      co2Emission.value = selectedModel.value.co2PerQuery
      sessionEmission.value += selectedModel.value.co2PerQuery
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

const TREE_COST = 2.6 // USD per tree

// Add function to calculate trees needed
const calculateTreesToPlant = (co2Amount: number): number => {
  if (!co2Amount || co2Amount <= 0) return 0;
  // Average tree absorbs about 22kg CO2 per year
  return Math.ceil(co2Amount / 22)
}

// Initialize emissions with zero
const co2Emission = ref(0)
const sessionEmission = ref(0)

const recommendedTrees = computed(() => calculateTreesToPlant(sessionEmission.value))
const recommendedAmount = computed(() => (recommendedTrees.value * TREE_COST).toFixed(2))
</script>

<template>
  <div id="CurrentSite"
    class="h-screen w-screen p-0 m-0 absolute left-0 top-0 transition-all">
    <div class="flex flex-row gap-10">
      <div class="w-full max-w-[18rem]">
        <aside
          class="sidebar h-full sidebar-fixed-left justify-start dark:bg-black">
          <section class="sidebar-title items-center p-4">

            <RouterLink to="/">
              <button
                class="flex items-center gap-2 text-gray translate-x-[170%] border transition-all px-3 py-2 btn bg-white hover:bg-gray-100/[.4] dark:bg-gray-900">
                <span class="dark:invert">
                  <HomeIcon />
                </span><span class="dark:text-white">Home</span>
              </button>
            </RouterLink>

          </section>
          <section
            class="sidebar-content h-fit min-h-[20rem] overflow-visible dark:bg-black">
            <nav class="menu rounded-md">
              <section class="menu-section px-4">
                <span class="menu-title dark:text-white">Your chats;</span>
                <ul class="menu-items">
                  <li class="menu-item transition-all dark:hover:bg-gray-900">
                    <div class="opacity-75 hover:opacity-100 dark:invert">
                      <ChatIcon />
                    </div>
                    <span class="dark:invert">Testing chat</span>
                  </li>
                  <li
                    class="menu-item transition-all border dark:hover:bg-gray-900">
                    <span class="text-lg opacity-70 dark:invert"
                      style="margin: 0 auto;">+</span>
                  </li>
                </ul>
              </section>
            </nav>
          </section>
          <section
            class="sidebar-footer h-full justify-end bg-gray-2 pt-2 dark:bg-black">
            <div class="divider my-0"></div>
            <div
              class=" z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4 dark:hover:bg-gray-900">
              <label class="whites mx-2 flex h-fit w-full cursor-pointer p-0 "
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

                  <div class="flex flex-col dark:text-white">
                    <span>Faeq Faisal</span>
                    <span
                      class="text-xs font-normal text-content2">faeqfaisal@hotmail.co.uk</span>
                  </div>

                  <label class="btn bg-transparent dark:invert" for="modal-1">
                    <SettingsIcon />
                  </label>
                  <input class="modal-state" id="modal-1" type="checkbox" />
                  <div class="modal w-screen">
                    <label class="modal-overlay" for="modal-1"></label>
                    <div
                      class="modal-content flex flex-col gap-5 dark:bg-gray-900 dark:text-white">
                      <label for="modal-1"
                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:invert">✕</label>
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
              <div
                class="popover-content popover-bottom-left bg-gray-100 dark:bg-gray-900"
                tabindex="0">
                <div class="popover-arrow dark:bg-gray-900"></div>
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
                      class="flex items-center p-4 border rounded-lg shadow bg-white dark:bg-black">
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
                      class="flex items-center p-4 border rounded-lg shadow bg-white dark:bg-black">
                      <CloudIcon />
                      <div class="ml-4">
                        <div
                          class="text-xl font-bold text-gray-800 dark:text-white">
                          {{ selectedModel.co2PerQuery.toFixed(3) }} kg
                        </div>
                        <div class="text-sm text-gray-500">CO₂ used from this
                          model per query
                        </div>
                      </div>
                    </div>
                    <!-- Metric 3: Suggested trees to plant -->
                    <div
                      class="flex items-center p-4 border rounded-lg shadow bg-white dark:bg-black">
                      <div class="-ml-[5px]">
                        <TreeIcon />
                      </div>
                      <div class="ml-[0.6rem]">
                        <div
                          class="text-xl font-bold text-gray-800 dark:text-white">
                          {{ calculateTreesToPlant(sessionEmission.value) }} Trees
                        </div>
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
              <div v-if="donateLoading"
                class="bg-green-50 dark:bg-green-900 rounded-lg shadow-lg p-6 w-[40vw] relative border border-green-200 dark:border-green-700">
                <div class="space-y-3 mt-3">
                  <div
                    class='flex space-x-2 justify-center items-center dark:invert'>
                    <span class='sr-only'>Loading...</span>
                    <div
                      class='h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'>
                    </div>
                    <div
                      class='h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'>
                    </div>
                    <div class='h-3 w-3 bg-black rounded-full animate-bounce'>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="JSON.stringify(donateData) != '{}'"
                class="bg-green-50 dark:bg-green-900 rounded-lg shadow-lg p-6 w-[40vw] relative border border-green-200 dark:border-green-700">
                <!-- Close Button -->
                <button @click="isDonationModalOpen = false"
                  class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold">
                  &times;
                </button>
                {{ JSON.stringify(donateData) }}
              </div>
              <div v-else
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

                <!-- Add Tree Infographic before the form -->
                <div class="bg-white dark:bg-black p-4 rounded-lg mb-6 border border-green-200 dark:border-green-700">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-700 dark:text-gray-300">Trees Needed:</span>
                    <span class="text-xl font-bold text-green-600">{{ recommendedTrees }} Trees</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700 dark:text-gray-300">Recommended Amount:</span>
                    <span class="text-xl font-bold text-green-600">${{ recommendedAmount }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-2 text-center">
                    Each tree costs ${{ TREE_COST.toFixed(2) }} USD
                  </div>
                </div>

                <div class="mb-4">
                  <label for="donationAmount"
                    class="block text-gray-800 dark:text-white mb-4">
                    Donation Amount ($)
                  </label>


                  <input type="number" id="donationAmount" :value="amount"
                    @input="onChangeAmount" class=" px-3 py-2 input-block input"
                    :placeholder="`Recommended: $${recommendedAmount}`" />

                </div>
                <div class="mb-4">
                  <label for="impactOffering"
                    class="block text-gray-800 dark:text-white mb-4">
                    Impact Offering
                  </label>
                  <select class="select select-block">
                    <option @click="() => selectedOffering = offering" class=""
                      v-for="offering in impactOfferings" :key="offering.name">{{
                        offering.name
                      }}</option>
                  </select>
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
                <button @click="pledge('TestName', 'testemail@test.com', '1')"
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
                Use your favourite LLM with net zero CO₂ emissions
              </p>
            </div>
          </div>

          <!-- Chat Container -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 mb-8">
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

                <li class="max-w-4xl py-2 flex gap-x-2 sm:gap-x-4" v-if="loading">
                  <div :class="[
                    'shrink-0 size-[38px] rounded-full flex items-center justify-center',
                    'bg-blue-600'
                  ]">
                    <span class="text-white">
                      AI
                    </span>
                  </div>
                  <div class="space-y-3 mt-3">
                    <div
                      class='flex space-x-2 justify-center items-center dark:invert'>
                      <span class='sr-only'>Loading...</span>
                      <div
                        class='h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'>
                      </div>
                      <div
                        class='h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'>
                      </div>
                      <div class='h-3 w-3 bg-black rounded-full animate-bounce'>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Input Area -->
          <div
            class="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-black dark:border-neutral-700">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
              <div class="relative">
                <textarea v-model="inputValue" @keypress="handleKeyPress"
                  class="p-4 pb-12 block w-full dark:bg-black border-gray-200 rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
                  placeholder="Ask me anything..."></textarea>

                <div
                  class="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-white dark:bg-black">
                  <div class="flex justify-between items-center">
                    <!-- Model Selector -->
                    <div class="relative">
                      <div class="popover mr-2">
                        <label
                          class="popover-trigger  btn bg-transparent border w-auto dark:invert"
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
