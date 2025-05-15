<template>
    <div class="edit-profile-container">
      <h2>Editar Perfil</h2>
      
      <div class="form-group">
        <label>Biografía</label>
        <textarea 
          v-model="bio" 
          maxlength="150" 
          placeholder="Cuéntanos sobre ti"
        ></textarea>
        <small>{{ bio.length }}/150</small>
      </div>
      
      <div class="form-group">
        <label>Foto de portada</label>
        <input 
          type="file" 
          accept="image/*"
          @change="handleCoverPhotoChange"
          ref="coverPhotoInput"
        >
        <button 
          @click="$refs.coverPhotoInput.click()"
          class="btn-upload"
        >
          Seleccionar imagen
        </button>
        <div v-if="coverPreview" class="image-preview">
          <img :src="coverPreview" alt="Vista previa">
        </div>
        <small v-if="coverError" class="error">{{ coverError }}</small>
      </div>
      
      <div class="form-group">
        <label>Foto de perfil</label>
        <input 
          type="file" 
          accept="image/*"
          @change="handleProfilePhotoChange"
          ref="profilePhotoInput"
        >
        <button 
          @click="$refs.profilePhotoInput.click()"
          class="btn-upload"
        >
          Seleccionar imagen
        </button>
        <div v-if="profilePreview" class="image-preview profile">
          <img :src="profilePreview" alt="Vista previa">
        </div>
        <small v-if="profileError" class="error">{{ profileError }}</small>
      </div>
      
      <div class="actions">
        <button @click="saveChanges" class="btn-save" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm"></span>
          Guardar cambios
        </button>
        <button @click="cancel" class="btn-cancel">
          Cancelar
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { doc, updateDoc, getDoc } from 'firebase/firestore';
  import { db, storage } from '@/main';
  import { getAuth } from 'firebase/auth';
  import { 
    ref as storageRef, 
    uploadBytes, 
    getDownloadURL 
  } from 'firebase/storage';
  
  const auth = getAuth();
  const user = auth.currentUser;
  
  const bio = ref('');
  const coverPhoto = ref(null);
  const profilePhoto = ref(null);
  const coverPreview = ref(null);
  const profilePreview = ref(null);
  const coverError = ref('');
  const profileError = ref('');
  const saving = ref(false);
  
  // Cargar datos iniciales
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    bio.value = userDoc.data().bio || '';
    coverPreview.value = userDoc.data().coverPhoto || null;
    profilePreview.value = userDoc.data().photoURL || null;
  }
  
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      coverError.value = 'La imagen debe ser menor a 5MB';
      return;
    }
    
    coverError.value = '';
    coverPhoto.value = file;
    coverPreview.value = URL.createObjectURL(file);
  };
  
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      profileError.value = 'La imagen debe ser menor a 2MB';
      return;
    }
    
    profileError.value = '';
    profilePhoto.value = file;
    profilePreview.value = URL.createObjectURL(file);
  };
  
  const uploadImage = async (file, path) => {
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    return getDownloadURL(ref);
  };
  
  const saveChanges = async () => {
    saving.value = true;
    try {
      const updates = { bio: bio.value };
      
      if (coverPhoto.value) {
        updates.coverPhoto = await uploadImage(
          coverPhoto.value, 
          covers/${user.uid}
        );
      }
      
      if (profilePhoto.value) {
        updates.photoURL = await uploadImage(
          profilePhoto.value, 
          profiles/${user.uid}
        );
      }
      
      await updateDoc(doc(db, 'users', user.uid), updates);
      window.location.reload(); // Para actualizar la foto en toda la app
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      saving.value = false;
    }
  };
  
  const cancel = () => {
    window.history.back();
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    display: block;
    margin-top: 5px;
  }
 
  </style>