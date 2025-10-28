<script setup lang="ts">
import { onAuthStateChanged,type User } from 'firebase/auth'
import { auth } from '../firebase'
import { ref } from 'vue'

const user = ref<User | null>(auth.currentUser)
onAuthStateChanged(auth, (u) => { user.value = u })
const apiBase = import.meta.env.VITE_API_BASE as string

type Product = { id: string; name: string; price: number; img: string; }
const products = ref<Product[]>([
  { id:'plasmic-sticker', name:'PLASMIC ステッカー', price:300,  img:'https://placehold.co/400x300?text=Sticker' },
  { id:'plasmic-tshirt',  name:'PLASMIC Tシャツ',    price:2500, img:'https://placehold.co/400x300?text=T-shirt' },
  { id:'plasmic-mug',     name:'PLASMIC マグカップ', price:1500, img:'https://placehold.co/400x300?text=Mug' },
])

const busy = ref<string | null>(null)
async function buy(productId: string) {
  try {
    busy.value = productId
    const res = await fetch(`${apiBase}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'request_failed')
    window.location.href = json.url
  } catch (e:any) {
    alert(e?.message || '決済の開始に失敗しました')
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <main class="wrap">
    <section class="hero">
      <h1 class="ttl">PLASMIC Shop</h1>
      <p class="desc" v-if="user">ようこそ、{{ user.email}}さん</p>
      <p class="desc" v-else>ログインしていません</p>
      <div class="mt-4 flex gap-4">
        <RouterLink v-if="user" to="/dashboard" class="underline">ダッシュボードへ</RouterLink>
        <RouterLink to="/login" class="underline">ダッシュボードへ</RouterLink>
      </div>
    </section>
    <section class="grid">
      <article v-for="p in products" :key="p.id" class="card">
        <img :src="p.img" alt="" class="thumb" />
        <div class="meta">
          <h2 class="name">{{ p.name }}</h2>
          <p class="price">¥{{ p.price.toLocaleString() }}</p>
          <button class="buy" :disabled="busy===p.id" @click="buy(p.id)">
            {{ busy===p.id ? '処理中…' : 'Buy' }}
          </button>
        </div>
      </article>
    </section>

    <p class="hint">ログインして確認しますか？？ <router-link to="/login">ログインはこちら</router-link></p>
  </main>
</template>