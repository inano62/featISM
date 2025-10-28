<script setup lang="ts">
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>

<template>
  <div style="text-align:center; margin-top:64px;">
    <h1>Dashboard</h1>
    <p>ようこそ！ {{ auth.currentUser?.email }}</p>
    <button @click="logout">ログアウト</button>
  </div>
</template>
