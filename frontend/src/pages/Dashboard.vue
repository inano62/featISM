<script setup lang="ts">
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { ref } from 'vue'
import OrdersSection from '@/components/dashboard/OrdersSection.vue'
import ManualPurchasesSection from '@/components/dashboard/ManualPurchasesSection.vue'

const user = ref(auth.currentUser)

const logout = async () => {
  await signOut(auth)
  location.href = '/'
}
</script>

<template>
  <main style="max-width:720px;margin:48px auto;">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>

    <p class="mb-2">ログイン中：{{ user?.email || '未ログイン' }}</p>
    <button
        class="mt-2 px-3 py-2 rounded bg-neutral-800 text-white mr-3"
        @click="logout"
    >
      ログアウト
    </button>
    <router-link to="/">ホームに戻る</router-link>

    <OrdersSection class="mt-8" />

    <ManualPurchasesSection class="mt-8" />
  </main>
</template>
