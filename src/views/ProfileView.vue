<template>
  <div class="profile-container">
    <!-- Portada -->
    <div class="cover-photo" :style="{ backgroundImage: 'url(' + coverPhoto + ')' }">
      <div class="profile-picture" @click="changeCoverPhoto">
        <img :src="user.photoURL" alt="Foto de perfil">
        <span class="edit-icon">✏️</span>
      </div>
    </div>

    <!-- Información del usuario -->
    <div class="profile-info">
      <h1>{{ user.displayName }}</h1>
      <p class="bio">{{ bio }}</p>
      <div class="stats">
        <div class="stat">
          <strong>{{ userPosts.length }}</strong>
          <span>Publicaciones</span>
        </div>
        <div class="stat" @click="showFollowers">
          <strong>{{ followersCount }}</strong>
          <span>Seguidores</span>
        </div>
        <div class="stat" @click="showFollowing">
          <strong>{{ followingCount }}</strong>
          <span>Seguidos</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="actions">
      <button @click="editProfile" class="btn-edit">
        ✏️ Editar perfil
      </button>
    </div>

    <!-- Publicaciones del usuario -->
    <div class="user-posts">
      <h3>Mis Publicaciones</h3>
      <div v-if="userPosts.length > 0" class="posts-grid">
        <CardComp 
          v-for="post in userPosts" 
          :key="post.id"
          :title="user.displayName"
          :parrafo="post.content"
          :picture="post.imageUrl"
          :header="{
            name: user.displayName,
            picture: user.photoURL
          }"
          :likes="true"
          :postId="post.id"
        />
      </div>
      <div v-else class="no-posts">
        <p>Aún no tienes publicaciones</p>
        <button @click="$router.push('/create-post')" class="btn-primary">
          Crear primera publicación
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth'
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/main'
import CardComp from '@/components/CardComp.vue'

export default {
  components: { CardComp },
  data() {
    return {
      user: null,
      bio: 'Biografía no especificada',
      coverPhoto: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      followersCount: 0,
      followingCount: 0,
      userPosts: []
    }
  },
  async created() {
    const auth = getAuth()
    this.user = auth.currentUser
    await this.loadUserData()
    this.loadUserPosts()
  },
  methods: {
    async loadUserData() {
      const userDoc = await getDoc(doc(db, 'users', this.user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        this.bio = data.bio || this.bio
        this.coverPhoto = data.coverPhoto || this.coverPhoto
        this.followersCount = data.followersCount || 0
        this.followingCount = data.followingCount || 0
      }
    },
    async loadUserPosts() {
      const q = query(
        collection(db, 'posts'),
        where('authorId', '==', this.user.uid),
        orderBy('createdAt', 'desc')
      )
      
      onSnapshot(q, (snapshot) => {
        this.userPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      })
    },
    editProfile() {
      this.$router.push('/edit-profile')
    },
    changeCoverPhoto() {
      // Implementar lógica para cambiar foto de portada
      alert('Funcionalidad para cambiar foto de portada en desarrollo')
    },
    showFollowers() {
      this.$router.push('/followers')
    },
    showFollowing() {
      this.$router.push('/following')
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
  border-radius: 8px;
  position: relative;
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
  cursor: pointer;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin: 10px 0 20px;
}

.stats {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.stat {
  text-align: center;
  cursor: pointer;
}

.stat strong {
  font-size: 18px;
  display: block;
}

.stat span {
  font-size: 14px;
  color: #65676b;
}

.actions {
  margin: 20px 0;
}

.btn-edit {
  background: #e4e6eb;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}

.user-posts {
  margin-top: 40px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.no-posts {
  text-align: center;
  padding: 40px 0;
}

.no-posts p {
  color: #65676b;
  margin-bottom: 20px;
}

.btn-primary {
  background: #1877f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
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