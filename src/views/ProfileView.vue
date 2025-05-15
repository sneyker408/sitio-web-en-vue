<script>
import { collection, getDocs } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/main';
import CardComp from '@/components/CardComp.vue';

export default {
  components: { CardComp },
  data() {
    return {
      posts: []
    }
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, 'posts'));

    // Mapeamos los posts y resolvemos las imágenes dinámicamente
    const postsData = await Promise.all(querySnapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      let imageUrl = null;

      // Si el post tiene imageUrl (path en Storage), obtenemos su URL actual
      if (data.imageUrl) {
        try {
          // Si ya es una URL completa, la usamos (por compatibilidad con posts antiguos)
          if (data.imageUrl.startsWith('http')) {
            imageUrl = data.imageUrl;
          } else {
            const imgRef = storageRef(storage, data.imageUrl);
            imageUrl = await getDownloadURL(imgRef);
          }
        } catch (error) {
          console.warn('No se pudo cargar la imagen del post', error);
          imageUrl = null;
        }
      }

      return {
        id: docSnap.id,
        content: data.content,
        imageUrl: imageUrl,
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
        comments: data.comments || [],
        authorName: data.authorName || 'Anónimo',
        authorPhoto: data.authorPhoto || null,
        timestamp: data.timestamp || data.createdAt || new Date()
      }
    }));

    this.posts = postsData;
  }
}
</script>
