<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

const orders = ref<any[]>([])

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    if (!u) {
      orders.value = []
      return
    }

    const ordersQ = query(
        collection(db, 'orders'),
        where('uid', '==', u.uid),
        orderBy('createdAt', 'desc')
    )
    onSnapshot(ordersQ, (snap) => {
      orders.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    })
  })
})
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold mb-2">注文一覧（orders / Stripe）</h2>
    <ul v-if="orders.length">
      <li v-for="o in orders" :key="o.id">
        {{ o.id }} — {{ o.status }} — {{ o.createdAt?.toDate?.() }}
      </li>
    </ul>
    <p v-else class="text-sm text-gray-400">注文はまだありません。</p>
  </section>
</template>
