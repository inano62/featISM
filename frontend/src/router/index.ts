import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from "../firebase.ts";

const HomePage      = () => import('../pages/Home.vue')
const LoginPage     = () => import('../pages/Login.vue')
const RegisterPage  = () => import('../pages/Register.vue')
const Success  = () => import('../pages/Success.vue')
const DashboardPage = () => import('../pages/Dashboard.vue')

const routes = [
    { path: '/',         name: 'home',      component: HomePage },
    { path: '/login',    name: 'login',     component: LoginPage },
    { path: '/register', name: 'register',  component: RegisterPage },
    { path: '/success', name: 'success',  component: Success },
    { path: '/dashboard',name: 'dashboard', component: DashboardPage, meta: { requiresAuth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })

let authReady: Promise<void> | null = null
function waitAuthReady() {
    if (authReady) return authReady
    authReady = new Promise((resolve) => {
        const off = onAuthStateChanged(auth, () => {
            off()
            resolve()
        })
    })
    return authReady
}

router.beforeEach(async (to, _from, next) => {
    await waitAuthReady()
    if (to.meta.requiresAuth && !auth.currentUser) return next("/login")
    next()
})

export default router