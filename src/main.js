import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/bootstrap.min.css'
import '@/assets/bootstrap.bundle.min.js'
import '@/assets/custom_styles.css'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import 'material-icons/iconfont/material-icons.css'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

// 👇 Reemplaza con tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAj6DTr5BfBtR91zNvCGHG7sVmhWzKtTFk",
  authDomain: "mazebook-vue.firebaseapp.com",
  projectId: "mazebook-vue",
  storageBucket: "mazebook-vue.firebasestorage.app",
  messagingSenderId: "467839171849",
  appId: "1:467839171849:web:c1bc7880f3b07baf27a7d8",
  measurementId: "G-MN253E52PQ"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

export { auth, db, storage, googleProvider, facebookProvider }




createApp(App).use(store).use(router).mount('#app')
