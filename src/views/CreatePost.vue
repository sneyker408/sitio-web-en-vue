<template> hola
  <div class="create-post container mt-3">
    <div class="card mx-auto" style="max-width: 550px;">
      <!-- Cabecera -->
      <div class="card-header bg-white d-flex align-items-center">
        <img
          :src="user.photoURL || defaultAvatar"
          alt="Profile"
          class="profile-pic me-2"
        />
        <h5 class="mb-0">{{ user.displayName || 'Usuario Anónimo' }}</h5>
      </div>

      <!-- Cuerpo -->
      <div class="card-body">
        <textarea
          v-model="postContent"
          class="form-control mb-3"
          placeholder="¿Qué estás pensando?"
          rows="3"
          :disabled="isLoading"
        ></textarea>

        <!-- Preview de imagen -->
        <div v-if="imagePreview" class="image-preview mb-3 position-relative">
          <img :src="imagePreview" alt="Preview" class="img-fluid rounded" />
          <button
            @click="removeImage"
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
            style="z-index: 1;"
            :disabled="isLoading"
          >
            <i class="material-icons">close</i>
          </button>
        </div>

        <!-- Botones -->
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleImageUpload"
              class="d-none"
            />
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

        <!-- Error -->
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

const defaultAvatar = 'https://randomuser.me/api/portraits/men/81.jpg';

const postContent   = ref('');
const imageFile     = ref(null);
const imagePreview  = ref(null);
const isLoading     = ref(false);
const error         = ref(null);

// ---------- DEBUG ----------
console.debug('[CreatePost] usuario logueado:', user);
// ---------------------------

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg','image/png','image/gif','image/webp'];
  if (!validTypes.includes(file.type)) {
    error.value = 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'La imagen no puede superar los 10MB';
    return;
  }

  imageFile.value    = file;
  imagePreview.value = URL.createObjectURL(file);
  error.value        = null;
};

const removeImage = () => {
  imageFile.value    = null;
  imagePreview.value = null;
  error.value        = null;
};

const createPost = async () => {
  // Sanity check
  console.debug('[createPost] contenido:', postContent.value, 'file:', imageFile.value);
  if (!postContent.value && !imageFile.value) {
    error.value = 'Escribe algo o sube una imagen';
    return;
  }

  isLoading.value = true;
  error.value     = null;

  try {
    if (!user) throw new Error('Debes iniciar sesión para publicar');

    let imageUrl = null;
    if (imageFile.value) {
      try {
        console.debug('[createPost] subiendo imagen...');
        const ext     = imageFile.value.name.split('.').pop();
        const path    = `posts/${user.uid}/${Date.now()}.${ext}`;
        const refStor = storageRef(storage, path);
        await uploadBytes(refStor, imageFile.value);
        imageUrl = await getDownloadURL(refStor);
        console.debug('[createPost] imagen subida, url ->', imageUrl);
      } catch (upErr) {
        console.error('[createPost] fallo al subir imagen:', upErr);
        throw new Error('Error subiendo imagen: ' + upErr.message);
      }
    }

    console.debug('[createPost] escribiendo post en Firestore...');
    const docRef = await addDoc(collection(db, 'posts'), {
      content:    postContent.value,
      imageUrl,
      authorId:   user.uid,
      authorName: user.displayName || 'Usuario Anónimo',  // 🔥 coincide con PostsView
      authorPhoto:user.photoURL   || '',
      likes:      0,
      likedBy:    [],
      comments:   [],
      createdAt:  serverTimestamp()                        // 🔥 coincide con PostsView
    });
    console.debug('[createPost] post creado, id ->', docRef.id);

    // Reset + redirect
    postContent.value = '';
    removeImage();
    router.push('/posts');

  } catch (err) {
    console.error('[createPost] ERROR GENERAL:', err);
    error.value = `Error al crear la publicación: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.profile-pic { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
/* ... resto de tus estilos ... */
</style>
