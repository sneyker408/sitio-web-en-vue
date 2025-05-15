<template>
  <div class="create-post container mt-3">
    <!-- Tarjeta de creación de post -->
    <div class="card mx-auto" style="max-width: 550px;">
      <!-- Encabezado con foto de perfil -->
      <div class="card-header bg-white d-flex align-items-center">
        <img 
          :src="user.photoURL || 'https://randomuser.me/api/portraits/men/81.jpg'" 
          alt="Profile" 
          class="profile-pic me-2"
        >
        <h5 class="mb-0">{{ user.displayName || 'Usuario' }}</h5>
      </div>

      <!-- Cuerpo: Textarea y previsualización de imagen -->
      <div class="card-body">
        <textarea
          v-model="postContent"
          class="form-control mb-3"
          placeholder="¿Qué estás pensando?"
          rows="3"
        ></textarea>

        <!-- Vista previa de la imagen -->
        <div v-if="imagePreview" class="image-preview mb-3 position-relative">
          <img :src="imagePreview" alt="Preview" class="img-fluid rounded">
          <button 
            @click="removeImage" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
            style="z-index: 1;"
          >
            <i class="material-icons">close</i>
          </button>
        </div>

        <!-- Botones para añadir imagen o publicar -->
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleImageUpload"
              class="d-none"
            >
            <button 
              @click="$refs.fileInput.click()" 
              class="btn btn-sm btn-outline-primary"
              :disabled="isLoading"
            >
              <i class="material-icons">image</i> Subir imagen
            </button>
          </div>
          <button
            @click="createPost"
            class="btn btn-primary"
            :disabled="(!postContent && !imageFile) || isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
            {{ isLoading ? 'Publicando...' : 'Publicar' }}
          </button>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="alert alert-danger mt-3 mb-0">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { db, storage } from '@/main';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';

const auth = getAuth();
const user = auth.currentUser;
const router = useRouter();

const postContent = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const isLoading = ref(false);
const error = ref(null);

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validaciones
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    error.value = 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    error.value = 'La imagen no puede superar los 10MB';
    return;
  }

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
  error.value = null;
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  error.value = null;
};

const createPost = async () => {
  if (!postContent.value && !imageFile.value) {
    error.value = 'Escribe algo o sube una imagen';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    // Verificar autenticación
    if (!user) {
      throw new Error('Debes iniciar sesión para publicar');
    }

    let imageUrl = null;

    // Subir imagen a Firebase Storage si existe
    if (imageFile.value) {
      const fileExtension = imageFile.value.name.split('.').pop();
      const storageReference = storageRef(
        storage, 
        `posts/${user.uid}/${Date.now()}.${fileExtension}`
      );
      await uploadBytes(storageReference, imageFile.value);
      imageUrl = await getDownloadURL(storageReference);
    }

    // Guardar post en Firestore
    await addDoc(collection(db, 'posts'), {
      content: postContent.value,
      imageUrl: imageUrl,
      authorId: user.uid,
      authorFullName: user.displayName || 'Usuario Anónimo',
      authorPhoto: user.photoURL || '',
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: serverTimestamp()
    });

    // Limpiar formulario
    postContent.value = '';
    removeImage();
    
    // Redirigir
    router.push('/posts');
  } catch (err) {
    console.error("Error al publicar:", err);
    error.value = `Error al crear la publicación: ${err.message}`;
    
    // Verifica si el error es específico de Storage
    if (err.code === 'storage/unauthorized') {
      error.value += '. No tienes permiso para subir imágenes.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.image-preview {
  border: 1px dashed #ddd;
  padding: 10px;
  border-radius: 8px;
  position: relative;
}

.image-preview img {
  max-height: 300px;
  object-fit: contain;
  width: 100%;
}

.material-icons {
  vertical-align: middle;
  font-size: 18px;
}
</style>