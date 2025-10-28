<!-- src/pages/Login.vue（超シンプル・サインアップとログイン両方） -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const msg = ref('')
const err = ref('')

async function login(){
  try{
    await signInWithEmailAndPassword(auth, email.value, password.value)
    await router.push('/dashboard')
    msg.value = 'Login OK（Emulator）'
    err.value = ''
  }catch(e:any){ err.value = e.message; msg.value = '' }
}
</script>

<template>
  <div style="display:grid;gap:8px;max-width:320px;margin:64px auto;">
    <input v-model="email" placeholder="email" />
    <input v-model="password" type="password" placeholder="password" />
    <div style="display:flex;gap:8px;">
      <button @click="login">Login</button>
    </div>
    <p style="margin-top:12px;">
      アカウントがありませんか？
      <router-link to="/register">新規登録はこちら</router-link>
    </p>
    <p style="color:limegreen" v-if="msg">{{ msg }}</p>
    <p style="color:#f55" v-if="err">{{ err }}</p>
  </div>
</template>
