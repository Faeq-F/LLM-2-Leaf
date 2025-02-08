<script>
import { onMounted } from 'vue';
import { computed, ref } from 'vue'

import jQuery from "jquery";
const $ = jQuery;
window.$ = $;


export default {
  setup() {
    onMounted(() => {
      window.addEventListener('load', (event) => {
        let siteImages = $('#2020IMG, #2021IMG, #2022IMG, #2023IMG, #2025IMG')
        siteImages.each(function (index) {
          $(this).on("click", () => { loadPage($(this)[0].id.slice(0, -3)) })
        }
        )
      })

      function loadPage(year) {
        console.log(year)
        $.ajax({
          url: 'https://faeq-f.github.io/PersonalSite' + year,
          success: function (result) {
            var head = result.match(/<head[^>]*>[\s\S]*<\/head>/gi);
            var body = result.match(/<body[^>]*>[\s\S]*<\/body>/gi);
            console.log(head)
            console.log(body)
            $('head').html(head)
            $('#CurrentSite').html(body)
          },
        })
      }
    })

    let showing = ref(false)
    function toggle() {
      showing.value = !showing.value
    }

    let chevron = computed(() => {
      return showing.value
        ? "w-5 h-5 text-gray-400/70 rotate-90 inline transition-all transform delay-[50ms]"
        : "-rotate-90 inline transition-all transform w-5 h-5 text-gray-400/70 delay-1000"
    })

    let position = computed(() => {
      return showing.value
        ? "w-screen absolute bottom-0 right-0 transition-all duration-500"
        : "w-screen absolute -bottom-[19rem] right-0 transition-all duration-500"
    })

    let bg = computed(() => {
      return showing.value
        ? "h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-50 transition-all duration-500"
        : "h-screen w-screen absolute top-0 left-0 bg-transparent transition-all duration-500"
    })

    return {
      showing,
      bg,
      position,
      chevron,
      toggle,
    };
  }
};
</script>

<template>
  <!-- <div :class="bg" @click="showing ? toggle() : () => { }"></div> -->
  <div :class="position">
    <div class="relative z-[99]">
      <div class="fixed inset-0 overflow-hidden" style="pointer-events: none;">
        <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div :class="position" style="pointer-events: all !important;">
            <button @click="toggle"
              class="bg-white border rounded-lg shadow-sm p-1 pr-2 relative ml-4 rounded-b-none font-normal border-b-0 text-sm">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                :class="chevron">
                <g fill="none" stroke="none">
                  <path d="M10 8.013l4 4-4 4" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </g>
              </svg>
              Archive
            </button>
            <div
              class="flex flex-col h-[19rem] py-5 bg-white border shadow-sm  rounded-lg m-4 my-0 overflow-y-hidden rounded-b-none rounded-tl-none">

              <div class="relative flex-1 px-4 mt-1 sm:px-5">
                <div class="absolute inset-0 px-4 sm:px-5">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.inProgress {
  cursor: pointer;
}

</style>
