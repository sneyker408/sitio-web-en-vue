<template>
    <!-- El template se mantiene igual que el que tienes -->
    <div>
      <transition name="fade">
        <div v-if="showDialog" class="photo-dialog-overlay" @click.self="closeDialog">
          <div class="photo-dialog" :class="{ 'uploading': uploading }">
            <h3>Cambiar foto de perfil</h3>
            
            <div class="dialog-options">
              <label class="option-btn upload-btn">
                <span class="material-icons">photo_camera</span>
                Subir nueva foto
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  @change="handleFileUpload"
                  class="file-input"
                  ref="fileInput"
                >
              </label>
              
              <button class="option-btn cancel-btn" @click="closeDialog">
                <span class="material-icons">close</span>
                Cancelar
              </button>
            </div>
            
            <div v-if="error" class="error-message">
              <span class="material-icons">error</span>
              {{ error }}
            </div>
  
            <div v-if="uploading" class="upload-progress">
              <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
              <span>Subiendo... {{ uploadProgress }}%</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import { getAuth, updateProfile } from 'firebase/auth'
  import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
  import { doc, updateDoc, serverTimestamp } from 'firebase/firestore' // Añadido serverTimestamp
  import { db } from '@/main'
  
  export default {
    name: 'ProfilePhotoUpdater',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        required: true,
        validator: value => /^[a-zA-Z0-9]+$/.test(value)
      }
    },
    data() {
      return {
        uploading: false,
        showDialog: this.show,
        error: null,
        uploadProgress: 0,
        uploadTask: null
      }
    },
    computed: {
      user() {
        return getAuth().currentUser
      }
    },
    watch: {
      show(newVal) {
        this.showDialog = newVal
        if (newVal) {
          this.error = null
          this.uploadProgress = 0
        }
      }
    },
    methods: {
      closeDialog() {
        if (this.uploadTask) {
          this.uploadTask.cancel()
        }
        this.showDialog = false
        this.$emit('close')
        this.resetFileInput()
      },
      
      resetFileInput() {
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = ''
        }
      },
      
      async handleFileUpload(event) {
        const file = event.target.files[0]
        if (!file) return
        
        try {
          const validTypes = ['image/jpeg', 'image/png', 'image/webp']
          const maxSize = 5 * 1024 * 1024 // 5MB
          
          if (!validTypes.includes(file.type)) {
            throw new Error('Formato no soportado. Use JPEG, PNG o WebP')
          }
          
          if (file.size > maxSize) {
            throw new Error(`La imagen excede 5MB (${(file.size/1024/1024).toFixed(2)}MB)`)
          }
          
          await this.processImageUpload(file)
        } catch (error) {
          this.error = error.message
        }
      },
      
      async processImageUpload(file) {
        try {
          this.uploading = true
          this.error = null
          this.uploadProgress = 0
          
          if (!this.user || this.user.uid !== this.userId) {
            throw new Error('Usuario no autorizado')
          }
          
          const storage = getStorage()
          const storagePath = `profile_photos/${this.user.uid}`
          const storageRef = ref(storage, storagePath)
          
          // Eliminar foto anterior si existe
          await this.deleteOldPhoto(this.user.photoURL)
          
          // Subir nueva foto
          this.uploadTask = uploadBytesResumable(storageRef, file)
          
          await new Promise((resolve, reject) => {
            this.uploadTask.on('state_changed',
              (snapshot) => {
                this.uploadProgress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
              },
              (error) => {
                reject(error)
              },
              async () => {
                try {
                  const photoURL = await getDownloadURL(this.uploadTask.snapshot.ref)
                  await this.updateUserProfile(photoURL)
                  this.$emit('photo-updated', photoURL)
                  resolve()
                } catch (error) {
                  reject(error)
                }
              }
            )
          })
          
          this.closeDialog()
        } catch (error) {
          this.handleUploadError(error)
        } finally {
          this.uploading = false
        }
      },
      
      async deleteOldPhoto(photoURL) {
        try {
          if (photoURL && photoURL.includes('firebasestorage.googleapis.com')) {
            const oldPhotoRef = ref(getStorage(), photoURL)
            await deleteObject(oldPhotoRef)
          }
        } catch (error) {
          if (error.code !== 'storage/object-not-found') {
            console.warn('Error eliminando foto anterior:', error)
          }
        }
      },
      
      async updateUserProfile(photoURL) {
        try {
          // Actualizar Auth
          await updateProfile(this.user, { photoURL })
          
          // Esperar breve momento para propagación
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Actualizar Firestore
          const userRef = doc(db, 'users', this.user.uid)
          await updateDoc(userRef, {
            photoURL,
            lastUpdated: serverTimestamp()
          })
        } catch (error) {
          console.error('Error actualizando perfil:', error)
          throw new Error('Los cambios se aplicarán al refrescar')
        }
      },
      
      handleUploadError(error) {
        console.error('Error en upload:', error)
        
        const errorMap = {
          'storage/unauthorized': 'No tiene permisos para subir archivos',
          'storage/canceled': 'Subida cancelada',
          'storage/unknown': 'Error desconocido en almacenamiento',
          'storage/quota-exceeded': 'Límite de almacenamiento excedido',
          'storage/retry-limit-exceeded': 'Tiempo de espera agotado'
        }
        
        this.error = errorMap[error.code] || error.message || 'Error al cambiar la foto'
      }
    }
  }
  </script>
  
  <style scoped>
  /* Tus estilos se mantienen igual */
  .photo-dialog-overlay {
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
  
  .photo-dialog {
    background: white;
    border-radius: 12px;
    padding: 25px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    position: relative;
    animation: slide-up 0.3s ease;
  }
  
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .photo-dialog h3 {
    margin: 0 0 20px 0;
    color: #333;
    text-align: center;
    font-size: 1.3rem;
  }
  
  .dialog-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .option-btn {
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .upload-btn {
    border: 2px solid #d11a2a;
    background: white;
    color: #d11a2a;
  }
  
  .upload-btn:hover {
    background: #d11a2a;
    color: white;
  }
  
  .cancel-btn {
    border: 2px solid #ccc;
    color: #333;
    margin-top: 5px;
  }
  
  .cancel-btn:hover {
    background: #f0f0f0;
  }
  
  .file-input {
    display: none;
  }
  
  .error-message {
    color: #d11a2a;
    margin-top: 15px;
    padding: 10px;
    background: #ffebee;
    border-radius: 6px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .upload-progress {
    margin-top: 15px;
    background: #f0f0f0;
    border-radius: 8px;
    padding: 8px;
    font-size: 0.9rem;
  }
  
  .progress-bar {
    height: 6px;
    background: #d11a2a;
    border-radius: 3px;
    margin-bottom: 5px;
    transition: width 0.3s ease;
  }
  
  .uploading::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 480px) {
    .photo-dialog {
      padding: 20px 15px;
    }
    
    .option-btn {
      padding: 10px 15px;
      font-size: 0.9rem;
    }
  }
  </style>