<template>
	<div class="posts-view">
	  <button @click="$router.push('/create-post')" class="create-post-btn">
		Crear nueva publicación
	  </button>
	  
	  <CardComp 
  v-for="post in posts" 
  :key="post.id"
  :postId="post.id"
  :parrafo="post.content"
  :picture="post.imageUrl"
  :header="{
    fullName: post.authorFullName, // Nombre completo
    picture: post.authorPhoto,
    timestamp: post.timestamp || post.createdAt,
    userId: post.userId
  }"
  :initialLikes="post.likes || 0"
  :initialComments="post.comments || []"
/>
	</div>
  </template>
  
  <script>
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '@/main';
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
  this.posts = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    likes: doc.data().likes || 0,
    likedBy: doc.data().likedBy || [],
    comments: doc.data().comments || [],
    timestamp: doc.data().timestamp || new Date() // Asegurar que tenga timestamp
  }));
}
  }
  </script>
  
  <style scoped>
  .posts-view {
	max-width: 500px;
	margin: 0 auto;
	padding: 16px;
  }
  
  .create-post-btn {
	width: 100%;
	padding: 10px;
	margin-bottom: 20px;
	background-color: #1877F2;
	color: white;
	border: none;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
  }
  </style>