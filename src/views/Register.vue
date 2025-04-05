<template>
    <div class="register-container">
      <div class="glass-card">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo ScamStore" class="logo">
          <h1>Únete a nuestra comunidad</h1>
        </div>
  
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="input-group">
            <input 
              type="email" 
              v-model="email" 
              placeholder=" "
              required
            >
            <label>Correo electrónico</label>
          </div>
  
          <div class="input-group">
            <input 
              type="password" 
              v-model="password" 
              placeholder=" "
              required
              minlength="6"
            >
            <label>Contraseña</label>
          </div>
  
          <div class="input-group">
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder=" "
              required
            >
            <label>Confirmar contraseña</label>
          </div>
  
          <button type="submit" class="register-btn" :disabled="loading">
            <span v-if="!loading">Crear cuenta</span>
            <div v-else class="spinner"></div>
          </button>
  
          <div v-if="error" class="error-message">{{ error }}</div>
        </form>
  
        <div class="social-login">
          <p>O regístrate con</p>
          <div class="social-icons">
            <button @click="signInWithGoogle" class="social-btn">
              <img src="@/assets/google-icon.png" alt="Google">
            </button>
            <button @click="signInWithFacebook" class="social-btn">
              <img src="@/assets/facebook-icon.png" alt="Facebook">
            </button>
          </div>
        </div>
  
        <router-link to="/login" class="login-link">
          ¿Ya tienes cuenta? <span>Inicia sesión</span>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db, googleProvider, facebookProvider } from '../main'
  import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
  import { doc, setDoc } from 'firebase/firestore'
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        loading: false
      }
    },
    methods: {
      async handleRegister() {
        if (this.password !== this.confirmPassword) {
          this.error = 'Las contraseñas no coinciden'
          return
        }
  
        this.loading = true
        this.error = ''
  
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            this.email, 
            this.password
          )
          
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: this.email,
            createdAt: new Date(),
            lastLogin: new Date()
          })
  
          this.$router.push('/profile')
        } catch (err) {
          this.error = this.getErrorMessage(err.code)
        } finally {
          this.loading = false
        }
      },
  
      async signInWithGoogle() {
        try {
          const result = await signInWithPopup(auth, googleProvider)
          await this.handleSocialLogin(result.user)
        } catch (err) {
          this.error = this.getErrorMessage(err.code)
        }
      },
  
      async signInWithFacebook() {
        try {
          const result = await signInWithPopup(auth, facebookProvider)
          await this.handleSocialLogin(result.user)
        } catch (err) {
          this.error = this.getErrorMessage(err.code)
        }
      },
  
      async handleSocialLogin(user) {
        const userRef = doc(db, 'users', user.uid)
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true })
        
        this.$router.push('/')
      },
  
      getErrorMessage(code) {
        const messages = {
          'auth/email-already-in-use': 'Este correo ya está registrado',
          'auth/invalid-email': 'Correo electrónico no válido',
          'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
          'auth/operation-not-allowed': 'Operación no permitida'
        }
        return messages[code] || 'Ocurrió un error al registrarse'
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .logo {
    height: 60px;
    margin-bottom: 15px;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 1.8rem;
    margin-bottom: 5px;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 20px;
  }
  
  .input-group input {
    width: 100%;
    padding: 15px 0 5px;
    border: none;
    border-bottom: 2px solid #dfe6e9;
    background: transparent;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .input-group input:focus {
    outline: none;
    border-bottom-color: #667eea;
  }
  
  .input-group label {
    position: absolute;
    top: 15px;
    left: 0;
    color: #7f8c8d;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  .input-group input:focus + label,
  .input-group input:not(:placeholder-shown) + label {
    top: 0;
    font-size: 0.8rem;
    color: #667eea;
  }
  
  .register-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;
  }
  
  .register-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  .register-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 15px;
    font-size: 0.9rem;
  }
  
  .social-login {
    margin: 30px 0;
    text-align: center;
  }
  
  .social-login p {
    color: #7f8c8d;
    margin-bottom: 15px;
    position: relative;
  }
  
  .social-login p::before,
  .social-login p::after {
    content: "";
    position: absolute;
    height: 1px;
    width: 30%;
    background: #dfe6e9;
    top: 50%;
  }
  
  .social-login p::before {
    left: 0;
  }
  
  .social-login p::after {
    right: 0;
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .social-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #dfe6e9;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .social-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .social-btn img {
    width: 24px;
    height: 24px;
  }
  
  .login-link {
    display: block;
    text-align: center;
    color: #7f8c8d;
    text-decoration: none;
    margin-top: 20px;
  }
  
  .login-link span {
    color: #667eea;
    font-weight: 600;
  }
  
  @media (max-width: 480px) {
    .glass-card {
      padding: 30px 20px;
    }
  }
  </style>