<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { onMounted, ref } from 'vue';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const data = ref<any>(null);
onMounted(async () => {
  const sid = new URLSearchParams(location.search).get('session_id');
  if (!sid) return;
  const r = await fetch(`${import.meta.env.VITE_API_BASE}/session?id=${sid}`);
  data.value = await r.json();
});

const route = useRoute()
const router = useRouter()
const saving = ref(true)
const sessionId = route.query.session_id as string
onMounted(async () => {
  const sid = new URLSearchParams(location.search).get('session_id')
  if (!sid) return
  await fetch(`${import.meta.env.VITE_API_BASE}/purchases/save`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({session_id: sid})
  }).catch(() => {
  }).finally(() => saving.value = false)
})
async function recordOrder() {
  const uid = auth.currentUser?.uid
  if (!uid) return router.push('/login')
  await setDoc(doc(db, 'orders', sessionId), {
    uid, status: 'paid', createdAt: serverTimestamp(), items: [{ price: import.meta.env.VITE_STRIPE_PRICE_ID, qty: 1 }]
  })
}
recordOrder()
</script>

<template>
  <div style="max-width:720px;margin:48px auto;">
    <h2>お支払いが完了しました（テスト）</h2>
    <p>セッションID：{{ $route.query.session_id }}</p>
    <p v-if="saving">購入履歴を保存中…</p>
    <p v-else>ダッシュボードで履歴を確認できます。</p>
    <router-link to="/dashboard">ダッシュボードへ</router-link>
  </div>
</template>
