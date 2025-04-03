<template>
	<div class="posts container">
		<h1 class="TituloAbsoluto">
			<span class="letter letra-0">S</span>
			<span class="letter letra-1">C</span>
			<span class="letter letra-2">A</span>
			<span class="letter letra-3">M</span>
			<span class="letter letra-4">S</span>
			<span class="letter letra-5">T</span>
			<span class="letter letra-6">O</span>
			<span class="letter letra-7">R</span>
			<span class="letter letra-8">E</span>
		</h1>
		<button @click="$router.push('/create-post')" class="btn btn-primary mb-3"
			style="max-width: 550px; margin: 0 auto; display: block;">
			Crear nueva publicación
		</button>
		<CardComp v-for="post in posts" :key="post.id" class="mt-2 mx-auto single-spot" :picture="post.imageUrl"
			:parrafo="post.content" :header="{
				name: post.authorName,
				picture: post.authorPhoto || 'https://randomuser.me/api/portraits/men/81.jpg',
			}" :likes="true" :postId="post.id" />
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


/* === Logo === */
.TituloAbsoluto {
	margin-top: 1rem;
	margin-bottom: 2rem;
	color: red;
	font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	font-size: 50px;
	text-align: center;
}

@keyframes levitar {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.letter {
  display: inline-block;
  animation: levitar 2s ease-in-out infinite;
}

.letra-0 { animation-delay: 0s; }
.letra-1 { animation-delay: 0.2s; }
.letra-2 { animation-delay: 0.4s; }
.letra-3 { animation-delay: 0.6s; }
.letra-4 { animation-delay: 0.8s; }
.letra-5 { animation-delay: 1s; }
.letra-6 { animation-delay: 1.2s; }
.letra-7 { animation-delay: 1.4s; }
.letra-8 { animation-delay: 1.6s; }
</style>