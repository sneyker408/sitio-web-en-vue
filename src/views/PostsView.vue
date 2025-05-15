<template>
  <div class="posts-container">
    <!-- Formulario para crear publicaciones -->
    <div class="post-creator-card">
      <div class="creator-header">
        <img :src="currentUserPhoto" alt="Tu foto" class="user-avatar">
        <button 
          @click="$router.push('/create-post')" 
          class="create-post-btn"
        >
          ¿Qué estás pensando?
        </button>
      </div>
    </div>

    <!-- Lista de publicaciones -->
    <div class="posts-list">
      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Cargando publicaciones...
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        <i class="fas fa-newspaper"></i>
        <p>No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>
      </div>

      <CardComp
        v-for="post in posts"
        :key="post.id"
        :postId="post.id"
        :parrafo="post.content"
        :picture="post.imageUrl"
        :header="{
          name: post.authorName,
          picture: post.authorPhoto,
          timestamp: post.createdAt
        }"
        :initialLikes="post.likes"
        :initialComments="post.comments"
      />
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/main';
import CardComp from '@/components/CardComp.vue';

export default {
  name: 'PostsView',
  components: { CardComp },
  data() {
    return {
      posts: [],
      loading: true,
      currentUserPhoto: 'https://via.placeholder.com/40' // reemplaza esto con la foto real si la tienes
    };
  },
  async created() {
    try {
      const snapshot = await getDocs(collection(db, 'posts'));

      const postsArr = await Promise.all(
        snapshot.docs.map(async docSnap => {
          const data = docSnap.data();
          let imageUrl = null;

          if (data.imageUrl) {
            try {
              if (data.imageUrl.startsWith('http')) {
                imageUrl = data.imageUrl;
              } else {
                const imgRef = storageRef(storage, data.imageUrl);
                imageUrl = await getDownloadURL(imgRef);
              }
            } catch (e) {
              console.warn('No se pudo cargar imagen:', e);
              imageUrl = null;
            }
          }

          return {
            id: docSnap.id,
            content: data.content || '',
            imageUrl,
            likes: data.likes || 0,
            comments: data.comments || [],
            authorName: data.authorName || 'Anónimo',
            authorPhoto: data.authorPhoto || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                       (data.createdAt || new Date())
          };
        })
      );

      this.posts = postsArr.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.posts-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.post-creator-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.creator-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.create-post-btn {
  flex: 1;
  padding: 10px 15px;
  text-align: left;
  background-color: #f0f2f5;
  border: none;
  border-radius: 20px;
  color: #65676b;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-post-btn:hover {
  background-color: #e4e6e9;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-spinner {
  text-align: center;
  padding: 20px;
  color: #65676b;
}

.loading-spinner i {
  margin-right: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 50px;
  color: #1877f2;
  margin-bottom: 15px;
}

.empty-state p {
  color: #65676b;
  margin: 0;
}
</style>
