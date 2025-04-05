<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <h2 v-if="content === 'terms'">Términos y Condiciones</h2>
        <h2 v-else>Política de Privacidad</h2>
        
        <div class="modal-body">
          <div v-if="content === 'terms'">
            <!-- Contenido de términos y condiciones -->
            <p>Al registrarte en ScamStore, aceptas nuestros términos de servicio...</p>
            <!-- Agrega más contenido aquí -->
          </div>
          
          <div v-else>
            <!-- Contenido de política de privacidad -->
            <p>Respetamos tu privacidad y nos comprometemos a proteger tus datos...</p>
            <!-- Agrega más contenido aquí -->
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="accept-btn" @click="$emit('close')">
            Entendido
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      content: {
        type: String,
        default: 'terms',
        validator: value => ['terms', 'privacy'].includes(value)
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 2rem;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .close-btn svg {
    width: 24px;
    height: 24px;
    fill: #636e72;
  }
  
  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .modal-body {
    margin-bottom: 2rem;
    line-height: 1.6;
    color: #2c3e50;
  }
  
  .modal-footer {
    display: flex;
    justify-content: center;
  }
  
  .accept-btn {
    padding: 0.8rem 2rem;
    background: #00b894;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .accept-btn:hover {
    background: #00a884;
    transform: translateY(-2px);
  }
  </style>