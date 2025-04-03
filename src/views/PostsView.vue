<template>
	<div class="posts container">
	  <h1 class="TituloAbsoluto">ScamScare</h1>
	  <button @click="$router.push('/create-post')" class="btn btn-primary mb-3"
			style="max-width: 550px; margin: 0 auto; display: block;">
			Crear nueva publicación
		</button>
	  <CardComp
		v-for="post in posts"
		:key="post.id"
		class="mt-2 mx-auto single-spot"
		:picture="post.imageUrl"
		:parrafo="post.content"
		:header="{
		  name: post.authorName,
		  picture: post.authorPhoto || 'https://randomuser.me/api/portraits/men/81.jpg',
		}"
		:likes="true"
		:postId="post.id"
	  />
	</div>
  </template>
  
  <script setup>
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '@/main';
  import { ref, onMounted } from 'vue';
  import CardComp from '../components/CardComp.vue';
  
  const posts = ref([]);
  
  onMounted(async () => {
	const querySnapshot = await getDocs(collection(db, 'posts'));
	posts.value = querySnapshot.docs.map(doc => ({
	  id: doc.id,
	  ...doc.data()
	}));
  });
  </script>
  
  <style scoped>
  .posts {
	min-height: 60vh;
	max-width: 895px;
	margin: auto;
  }
  .single-spot {
	max-width: 550px;
  }
  .logo {
	max-width: 115px;
	padding: 0.2rem;
  }

  .TituloAbsoluto {
	margin-top: 1rem;
	margin-bottom: 2rem;
	color: red;
	font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	font-size: 50px;
	text-align: center;
}
  </style>