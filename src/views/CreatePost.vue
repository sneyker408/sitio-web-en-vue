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
          <div v-if="imagePreview" class="image-preview mb-3">
            <img :src="imagePreview" alt="Preview" class="img-fluid rounded">
            <button @click="removeImage" class="btn btn-sm btn-danger mt-2">
              Eliminar imagen
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
              >
                <i class="material-icons">image</i> Subir imagen
              </button>
            </div>
            <button
              @click="createPost"
              class="btn btn-primary"
              :disabled="!postContent && !imageFile"
            >
              Publicar
            </button>
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
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validar tamaño (opcional: 10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no puede superar los 10MB');
      return;
    }
  
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  };
  
  const removeImage = () => {
    imageFile.value = null;
    imagePreview.value = null;
  };
  
  const createPost = async () => {
    if (!postContent.value && !imageFile.value) {
      alert('Escribe algo o sube una imagen');
      return;
    }
  
    try {
      let imageUrl = null;
  
      // Subir imagen a Firebase Storage si existe
      if (imageFile.value) {
        const storageReference = storageRef(
          storage, 
          `posts/${user.uid}/${Date.now()}_${imageFile.value.name}`
        );
        await uploadBytes(storageReference, imageFile.value);
        imageUrl = await getDownloadURL(storageReference);
      }
  
      // Guardar post en Firestore
      await addDoc(collection(db, 'posts'), {
        content: postContent.value,
        imageUrl: imageUrl,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      });
  
      // Redirigir al muro de publicaciones
      router.push('/posts');
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error al crear la publicación");
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
  }
  
  .image-preview img {
    max-height: 300px;
    object-fit: contain;
  }
  </style>