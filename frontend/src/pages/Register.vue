<script setup lang="ts">
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const displayName = ref('')
const loading = ref(false)
const err = ref('')
const router = useRouter()

function mapError(code: string) {
  const map: Record<string,string> = {
    'auth/email-already-in-use': 'このメールは既に登録されています',
    'auth/invalid-email': 'メール形式が正しくありません',
    'auth/weak-password': 'パスワードは6文字以上にしてください',
    'auth/network-request-failed': 'ネットワークに接続できません（エミュ確認）',
  }
  return map[code] ?? '登録に失敗しました'
}

async function signup() {
  err.value = ''
  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)
    if (displayName.value) {
      await updateProfile(cred.user, { displayName: displayName.value })
    }
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName.value || null,
      createdAt: serverTimestamp()
    })
    router.push('/')
  } catch (e:any) {
    err.value = mapError(e.code || e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="signup" style="display:grid;gap:10px;max-width:360px;margin:64px auto;">
    <h2>新規登録</h2>
    <input v-model="displayName" placeholder="表示名（任意）" />
    <input v-model="email" type="email" placeholder="メールアドレス" required />
    <input v-model="password" type="password" minlength="6" placeholder="パスワード（6文字以上）" required />
    <button :disabled="loading">{{ loading ? '登録中…' : '登録' }}</button>
    <p style="margin-top:12px;">
      すでにアカウントをお持ちですか？
      <router-link to="/login">ログインへ</router-link>
    </p>
    <p v-if="err" style="color:#f55">{{ err }}</p>
  </form>
</template>
