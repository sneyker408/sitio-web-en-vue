<template>
  <div class="profile-container">
    <!-- Portada -->
    <div class="cover-photo" :style="{ backgroundImage: 'url(https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg)' }">
      <div class="profile-picture">
        <img :src="user.photoURL || 'https://randomuser.me/api/portraits/men/81.jpg'" alt="Foto de perfil">
      </div>
    </div>

    <!-- Información del usuario -->
    <div class="profile-info">
      <h1>{{ user.displayName || 'Usuario Mazebook' }}</h1>
      <p class="bio">{{ bio || 'Biografía no especificada' }}</p>
      <div class="stats">
        <div class="stat">
          <strong>125</strong>
          <span>Publicaciones</span>
        </div>
        <div class="stat">
          <strong>1.2K</strong>
          <span>Seguidores</span>
        </div>
        <div class="stat">
          <strong>350</strong>
          <span>Seguidos</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="actions">
      <button class="btn-edit">Editar perfil</button>
      <button class="btn-settings">
        <span class="material-icons-round">settings</span>
      </button>
    </div>

    <!-- Publicaciones del usuario -->
    <div class="user-posts">
      <h3>Publicaciones</h3>
      <div class="posts-grid">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-thumbnail"
          :style="{ backgroundImage: 'url(' + post.image + ')' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/main'

export default {
  name: 'ProfileView',
  data() {
    return {
      user: {},
      bio: 'Amante de los perros y la tecnología 🐕💻',
      posts: [
        { id: 1, image: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg' },
        { id: 2, image: 'https://images.pexels.com/photos/4067904/pexels-photo-4067904.jpeg' },
        { id: 3, image: 'https://images.pexels.com/photos/142497/pexels-photo-142497.jpeg' }
      ]
    }
  },
  async created() {
    const auth = getAuth()
    this.user = auth.currentUser
    
    // Obtener posts del usuario desde Firestore
    try {
      const q = query(collection(db, "posts"), where("authorId", "==", this.user.uid))
      const querySnapshot = await getDocs(q)
      this.posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error("Error cargando posts:", error)
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 935px;
  margin: 0 auto;
  padding: 20px;
}

.cover-photo {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px;
}

.profile-picture {
  position: absolute;
  bottom: -50px;
  left: 20px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid white;
  overflow: hidden;
  background: #f0f2f5;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  margin-top: 70px;
  padding: 0 20px;
}

.profile-info h1 {
  margin: 0;
  font-size: 28px;
}

.bio {
  color: #65676b;
  margin: 10px 0;
}

.stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.stat {
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  padding: 0 20px;
}

.btn-edit {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  font-weight: bold;
}

.btn-settings {
  width: 40px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-posts {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-top: 15px;
}

.post-thumbnail {
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .cover-photo {
    height: 200px;
  }
  
  .profile-picture {
    width: 100px;
    height: 100px;
    bottom: -30px;
  }
}
</style>