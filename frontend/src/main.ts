import './firebase'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useDefaultPersistence } from "./auth-persistence.ts"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase.ts"

await useDefaultPersistence();
await new Promise<void>((resolve) => {
    const off = onAuthStateChanged(auth, () => { off(); resolve(); });
});

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')