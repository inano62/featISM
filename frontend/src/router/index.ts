import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from "../firebase.ts";

const HomePage      = () => import('../pages/Home.vue')
const LoginPage     = () => import('../pages/Login.vue')
const RegisterPage  = () => import('../pages/Register.vue')
const DashboardPage = () => import('../pages/Dashboard.vue')

const routes = [
    { path: '/',         name: 'home',      component: HomePage },
    { path: '/login',    name: 'login',     component: LoginPage },
    { path: '/register', name: 'register',  component: RegisterPage },
    { path: '/dashboard',name: 'dashboard', component: DashboardPage, meta: { requiresAuth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
    if (!to.meta.requiresAuth) return next()
    const un = onAuthStateChanged(auth, (u) => {
        un()
        u ? next() : next('/login')
    })
})

export default router