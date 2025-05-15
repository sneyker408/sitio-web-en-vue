import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/', name: 'login', component: HomeView, meta: { requiresGuest: true }
  },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/posts', name: 'posts', component: () => import('../views/PostsView.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/create-post', name: 'create-post', component: () => import('../views/CreatePost.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', name: 'register', component: Register, meta: { requiresGuest: true } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/ForgotPassword.vue'), meta: { requiresGuest: true } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const isAuthenticated = await new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      resolve(!!user)
      unsubscribe()
    })
  })
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)

  if (requiresAuth && !isAuthenticated) next('/')
  else if (requiresGuest && isAuthenticated) next('/posts')
  else next()
})

export default router
