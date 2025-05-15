import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/bootstrap.min.css'
import '@/assets/bootstrap.bundle.min.js'
import '@/assets/custom_styles.css'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"              // <-- Analytics
import 'material-icons/iconfont/material-icons.css'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

// 👇 Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAj6DTr5BfBtR91zNvCGHG7sVmhWzKtTFk",
  authDomain: "mazebook-vue.firebaseapp.com",
  projectId: "mazebook-vue",
  storageBucket: "mazebook-vue.firebasestorage.app",    // ← Asegúrate que coincide
  messagingSenderId: "467839171849",
  appId: "1:467839171849:web:c1bc7880f3b07baf27a7d8",
  measurementId: "G-MN253E52PQ"
}

// Inicializas la app
const app = initializeApp(firebaseConfig)

// **Aquí añadimos Analytics**
const analytics = getAnalytics(app)

// Instancias de servicios
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

// Exporta todo para poder usarlo desde cualquier parte
export { auth, db, storage, googleProvider, facebookProvider, analytics }

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
