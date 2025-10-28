<!-- src/pages/Login.vue（超シンプル・サインアップとログイン両方） -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { useDefaultPersistence,useSessionOnly } from '../auth-persistence'

const remember = ref(true)
const email = ref('')
const password = ref('')
const msg = ref('')
const err = ref<string | null>(null)
const router = useRouter()

async function submit(){
  err.value = null;
  await (remember.value ? useDefaultPersistence() : useSessionOnly())
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (e:any) {
    err.value = e.message
  }
}
async function register(){
  err.value = null;
  await (remember.value ? useDefaultPersistence() : useSessionOnly())
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  }catch(e:any){ err.value = e.message }
}

</script>

<template>
  <div style="display:grid;gap:8px;max-width:320px;margin:64px auto;">
    <h2 class="text-xl front-semibold mb-4">ログイン</h2>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded bg-neutral-900 text-white" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded bg-neutral-900 text-white" />
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" class="form-checkbox" v-model="remember" />
        この端末でログイン状態を保持する
      </label>
      <button class="w-full p-2 rounded bg-pink-500 text-black font-semibold">ログイン</button>
      <p v-if="err" class="text-red-500 text-sm mt-2">{{err}}</p>
    </form>
    <p style="margin-top:12px;">
      アカウントがありませんか？
      <p class="text-sm mt-3">
        初めての方は <button class="underline" @click="register">新規登録</button>
      </p>
    </p>
    <p style="margin-top:12px;">
      元画面に戻りますか？？
      <router-link to="/">ホームに戻る</router-link>
    </p>
    <p style="color:limegreen" v-if="msg">{{ msg }}</p>
    <p style="color:#f55" v-if="err">{{ err }}</p>
  </div>
</template>
