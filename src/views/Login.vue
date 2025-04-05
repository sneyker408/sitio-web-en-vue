<template>
  <div class="login-container">
    <div class="background-overlay"></div>
    
    <div class="login-card">
      <div class="brand-section">
        <h1>SCAMSTORE</h1>
        <p class="tagline">Conéctate de forma segura con tu comunidad</p>
      </div>

      <div class="info-badge">
        <span>v2023 • Alcool Pazás</span>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
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

        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder=" " 
            required
          />
          <label>Contraseña</label>
          <div class="underline"></div>
        </div>

        <button type="submit" class="login-btn">
          <span>Acceder</span>
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>

      <div class="actions">
        <router-link to="/forgot-password" class="forgot-link">
  ¿Contraseña olvidada?
</router-link>
  <button @click="goToRegister" class="register-btn">
    Crear cuenta nueva
  </button>
</div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert('Error al iniciar sesión: ' + error.message);
      }
    },
    goToRegister() {
      console.log('Intentando navegar a registro') // Para debug
      if (this.$route.path !== '/register') {
        this.$router.push('/register').catch(err => {
          console.error('Error de navegación:', err)
          window.location.href = '/register' // Fallback seguro
        })
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('@/assets/login-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-section h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.tagline {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.info-badge {
  background: #f1f2f6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  color: #57606f;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 1rem 0 0.5rem;
  border: none;
  background: transparent;
  border-bottom: 1px solid #dfe6e9;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-bottom-color: #0984e3;
}

.input-group label {
  position: absolute;
  top: 1rem;
  left: 0;
  color: #636e72;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: 0;
  font-size: 0.8rem;
  color: #0984e3;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #0984e3;
  transition: all 0.3s ease;
}

.input-group input:focus ~ .underline {
  width: 100%;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0984e3, #6c5ce7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(9, 132, 227, 0.4);
}

.login-btn svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.8rem;
}

.forgot-link {
  color: #636e72;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #0984e3;
}

.register-btn {
  background: transparent;
  border: none;
  color: #2d3436;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.register-btn:hover {
  color: #6c5ce7;
  text-decoration: underline;
}
</style>