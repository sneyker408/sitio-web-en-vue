<template>
    <div class="login-container">
      <div class="background-overlay"></div>
      
      <div class="login-card">
        <div class="brand-section">
          <h1>SCAMSTORE</h1>
          <p class="tagline">Recupera tu acceso</p>
        </div>
  
        <div class="info-badge">
          <span>v2023 • Alcool Pazás</span>
        </div>
  
        <form @submit.prevent="handlePasswordReset" class="login-form">
          <div class="input-group">
            <input 
              type="email" 
              v-model="email" 
              placeholder=" " 
              required
            />
            <label>Correo electrónico</label>
            <div class="underline"></div>
          </div>
  
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#27ae60" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            Correo enviado. Revisa tu bandeja de entrada.
          </div>
  
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="!loading">Enviar enlace de recuperación</span>
            <div v-else class="spinner"></div>
            <svg v-if="!loading" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
  
        <div class="actions">
          <router-link to="/login" class="forgot-link">
            ← Volver al inicio de sesión
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
  
  export default {
    name: 'ForgotPasswordPage',
    data() {
      return {
        email: '',
        loading: false,
        error: null,
        success: false
      }
    },
    methods: {
      async handlePasswordReset() {
        if (!this.email) {
          this.error = 'Por favor ingresa tu correo electrónico';
          return;
        }
  
        this.loading = true;
        this.error = null;
        this.success = false;
  
        try {
          const auth = getAuth();
          await sendPasswordResetEmail(auth, this.email);
          this.success = true;
        } catch (error) {
          this.error = this.getErrorMessage(error.code);
          console.error('Error al enviar correo de recuperación:', error);
        } finally {
          this.loading = false;
        }
      },
      getErrorMessage(code) {
        const messages = {
          'auth/invalid-email': 'Correo electrónico inválido',
          'auth/user-not-found': 'No hay cuenta asociada a este correo',
          'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
          'auth/missing-email': 'Por favor ingresa tu correo electrónico'
        };
        return messages[code] || 'Error al enviar correo de recuperación';
      }
    }
  }
  </script>
  
  <style scoped>
  /* Todos los estilos se mantienen igual que en Login.vue */
  /* Solo añadimos estos estilos adicionales */
  
  .error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 15px;
    font-size: 0.9rem;
  }
  
  .success-message {
    color: #27ae60;
    text-align: center;
    margin-top: 15px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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
  
  /* Mantenemos el hover effect igual que en Login */
  .forgot-link:hover {
    color: #0984e3;
    text-decoration: underline;
  }
  </style>