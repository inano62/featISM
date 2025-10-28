<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import {
  onAuthStateChanged,
} from 'firebase/auth'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const user = ref(auth.currentUser)
const purchases = ref<any[]>([])
const itemName = ref('')
const price = ref<number | null>(null)

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (!u) {
      purchases.value = []
      return
    }

    const purchasesQ = query(
        collection(db, 'purchases'),
        where('userId', '==', u.uid),
        orderBy('createdAt', 'desc')
    )
    onSnapshot(purchasesQ, (snap) => {
      purchases.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    })
  })
})

const addPurchase = async () => {
  if (!user.value) return
  if (!itemName.value.trim()) return
  if (price.value == null) return

  await addDoc(collection(db, 'purchases'), {
    userId: user.value.uid,
    itemName: itemName.value.trim(),
    price: price.value,
    createdAt: serverTimestamp(),
  })

  itemName.value = ''
  price.value = null
}

const deletePurchase = async (id: string) => {
  await deleteDoc(doc(db, 'purchases', id))
}
</script>

<template>
  <section class="max-w-md bg-gray-800 p-4 rounded-lg text-white">
    <h2 class="text-xl font-semibold mb-3">購入登録（CRUD）</h2>

    <input
        v-model="itemName"
        type="text"
        placeholder="商品名"
        class="text-black p-2 rounded w-full mb-2"
    />
    <input
        v-model.number="price"
        type="number"
        placeholder="価格"
        class="text-black p-2 rounded w-full mb-2"
    />
    <button @click="addPurchase" class="bg-green-600 px-3 py-1 rounded">
      追加
    </button>

    <h3 class="text-lg font-semibold mt-6 mb-2">購入履歴（purchases）</h3>
    <ul v-if="purchases.length">
      <li
          v-for="p in purchases"
          :key="p.id"
          class="flex justify-between py-2 border-b border-gray-700"
      >
        <div>
          <p class="font-bold">{{ p.itemName }}</p>
          <p class="text-sm text-gray-400">{{ p.price }} 円</p>
        </div>
        <button
            @click="deletePurchase(p.id)"
            class="bg-red-600 px-2 rounded"
        >
          削除
        </button>
      </li>
    </ul>
    <p v-else class="text-sm text-gray-400">購入履歴はまだありません。</p>
  </section>
</template>
