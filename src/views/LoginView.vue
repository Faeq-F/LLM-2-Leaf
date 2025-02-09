<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/store'

const userStore = useUserStore()
const loading = ref(false);
const error = ref('')
const email = ref('')
const password = ref('')

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function signUp(event) {
  loading.value = true
  error.value = ''
  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email'
    loading.value = false
    return
  }
  if (password.value.trim() == '') {
    error.value = 'Please enter a password'
    loading.value = false
    return
  }
  let response = await fetch('http://localhost:5038/api/get/collection/' + 'Users')
  let users = await response.json()
  for (let i of users) {
    if (i.email == email.value) {
      error.value = 'User already exists!'
      loading.value = false
      return
    }
  }
  const data = new FormData();
  data.append('newData', JSON.stringify({ email: email.value, password: password.value, hg_token: '' }));
  let response2 = await fetch('http://localhost:5038/api/insert/collection/' + 'Users', {
    method: 'POST',
    body: data
  })
  if (response2.status != 200) {
    error.value = 'Something went wrong!'
  } else {
    let id = await response2.text()
    userStore.setVal({ _id: id, email: email.value, password: password.value, hg_token: '' })
    console.log('User is', userStore.user)
    window.location.href = '/chat'
  }
  loading.value = false
}

async function logIn(event) {
  loading.value = true
  error.value = ''
  let response = await fetch('http://localhost:5038/api/get/collection/' + 'Users')
  let users = await response.json()
  for (let i of users) {
    if (i.email == email.value && i.password == password.value) {
      userStore.setVal(i)
      console.log('User is', userStore.user)
      window.location.href = '/chat'
    }
  }
  error.value = 'User does not exist!'
  loading.value = false
}

</script>

<template>
  <div id="CurrentSite" class="h-screen w-screen p-0 m-0 absolute left-0 top-0">


    <div class="homepage">
      <h1 class="homepage_title">Welcome to LLM 2 Leaf.</h1>
    </div>
    <div v-if="loading" class="main_title p-4">
      <div class="space-y-3 mt-3">
        <div class='flex space-x-2 justify-center items-center dark:invert'>
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
    <div class="main_title p-4" v-else>
      <input class="input input-block darK:text-white dark:bg-black"
        placeholder="Email" type="email" v-model="email" />
      <input class="input input-block mt-2" placeholder="Password" type="password"
        v-model="password" />
      <div className=" mt-2 btn-group btn-group-scrollable w-full max-w-full">
        <div class="btn w-full" @click="(e) => { signUp(e) }">Sign Up</div>
        <div
          class="btn w-full bg-green-600 text-white hover:!bg-green-500 border-l-2"
          @click="(e) => { logIn(e) }">
          Log In
        </div>
      </div>
      <div v-if="error != ''" class="bg-red-400 text-white rounded p-2 mt-4">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_title {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid black;
  margin-top: 200px;
  margin-left: 35%;
  margin-right: 35%;
  background-color: rgba(255, 255, 255, 0.645);

}

.main_title_text1 {
  text-align: center;
  font-size: 18px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.main_title_textbox1,
.main_title_textbox2,
.main_title_textbox3 {
  border-radius: 25px;
  border: 0.5px solid black;
  width: 100%;
  height: 70px;
  padding: 0px 100px;
}

.main_title_textbox1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 10px;
}

.main_title_textbox1:hover,
.main_title_textbox2:hover,
.main_title_textbox3:hover {
  background-color: rgb(164, 164, 164)
}

.deepseek_logo {
  width: 55.5px;
  height: 34px;
  border-radius: 100px;
  margin-left: 9px;
  margin-right: 6px;

}

.deepseek_text {
  width: auto;
  font-size: 17px;
  text-align: center;
}

.main_title_textbox3 {
  margin-bottom: 24.8px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chatGPT_logo {
  width: 70px;
  height: 40px;
}

.chatGPT_text {
  margin-top: 16px;
  margin-left: 20px;
  margin-bottom: 16px;
  height: 40px;
  font-size: 17px;
}

.main_title_textbox2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
}

.ClaudeAI_logo {
  width: 36px;
  height: 36px;
  margin-right: 12px;
  margin-left: 17px;

}

.ClaudeAI_text {
  font-size: 17px;
  margin-left: 4px;
}

.homepage_title {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 60px;
  font-weight: bold;
  font-size: x-large;
}

.forest {
  position: relative;
  z-index: 1;
  margin: 0;

}

#CurrentSite {
  background-image: url('/Forest.webp');
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  padding-bottom: 0;
}
</style>
