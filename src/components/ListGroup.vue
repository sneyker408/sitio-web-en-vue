<template>
	<ul class="list-group">
	  <li v-if="likesCount > 0" class="list-group-item text-muted">
		A {{ likesCount }} personas les gusta esto
	  </li>
	  <li class="list-group-item">
		<div class="row">
		  <div class="col d-grid">
			<button 
			  @click="toggleLike"
			  class="btn d-flex justify-content-center align-items-center gap-2 px-0"
			  :class="{ 'text-primary': isLiked }"
			  :disabled="loading"
			>
			  <span class="material-icons-round">thumb_up</span>
			  {{ isLiked ? 'Me gusta' : '¿Te gusta?' }}
			  <span v-if="loading" class="spinner-border spinner-border-sm"></span>
			</button>
		  </div>
		  <div class="col d-grid">
			<button 
			  @click="showComments = !showComments"
			  class="btn d-flex justify-content-center align-items-center gap-2 px-0"
			>
			  <span class="material-icons-round">chat_bubble_outline</span>
			  Comentar
			</button>
		  </div>
		</div>
	  </li>
	  <li v-if="showComments" class="list-group-item">
		<div class="mb-3">
		  <textarea 
			v-model="newComment"
			class="form-control" 
			placeholder="Escribe algo..."
			:disabled="commentLoading"
		  ></textarea>
		</div>
		<button 
		  @click="addComment"
		  class="btn btn-primary btn-sm"
		  :disabled="!newComment.trim() || commentLoading"
		>
		  <span v-if="commentLoading" class="spinner-border spinner-border-sm"></span>
		  Publicar
		</button>
		<div 
		  v-for="(comment, index) in comments" 
		  :key="index" 
		  class="mt-2 p-2 border-top"
		>
		  <strong>{{ comment.userName }}</strong>: {{ comment.text }}
		</div>
	  </li>
	</ul>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { 
	doc, updateDoc, arrayUnion, arrayRemove,
	increment, getDoc 
  } from 'firebase/firestore';
  import { db } from '@/main';
  import { getAuth } from 'firebase/auth';
  
  const props = defineProps({
	postId: { type: String, required: true }
  });
  
  const auth = getAuth();
  const likesCount = ref(0);
  const isLiked = ref(false);
  const showComments = ref(false);
  const newComment = ref('');
  const comments = ref([]);
  const loading = ref(false);
  const commentLoading = ref(false);
  
  const loadData = async () => {
	const postRef = doc(db, 'posts', props.postId);
	const postSnap = await getDoc(postRef);
	
	if (postSnap.exists()) {
	  const data = postSnap.data();
	  likesCount.value = data.likes || 0;
	  comments.value = data.comments || [];
	  isLiked.value = auth.currentUser?.uid && data.likedBy?.includes(auth.currentUser.uid);
	}
  };
  
  const toggleLike = async () => {
	if (!auth.currentUser) return alert('Inicia sesión para dar like');
	loading.value = true;
	
	const postRef = doc(db, 'posts', props.postId);
	try {
	  await updateDoc(postRef, {
		likes: increment(isLiked.value ? -1 : 1),
		likedBy: isLiked.value 
		  ? arrayRemove(auth.currentUser.uid) 
		  : arrayUnion(auth.currentUser.uid)
	  });
	  isLiked.value = !isLiked.value;
	  likesCount.value += isLiked.value ? 1 : -1;
	} catch (error) {
	  console.error("Error al dar like:", error);
	} finally {
	  loading.value = false;
	}
  };
  
  const addComment = async () => {
	if (!auth.currentUser) return alert('Inicia sesión para comentar');
	commentLoading.value = true;
	
	try {
	  const comment = {
		userName: auth.currentUser.displayName || 'Anónimo',
		userId: auth.currentUser.uid,
		text: newComment.value.trim(),
		date: new Date().toISOString()
	  };
	  
	  await updateDoc(doc(db, 'posts', props.postId), {
		comments: arrayUnion(comment)
	  });
	  comments.value.push(comment);
	  newComment.value = '';
	} catch (error) {
	  console.error("Error al comentar:", error);
	} finally {
	  commentLoading.value = false;
	}
  };
  
  onMounted(loadData);
  </script>
  
  <style scoped>
  .btn:hover {
	background-color: rgba(0, 0, 0, 0.05);
  }
  .text-primary {
	color: #0d6efd !important;
  }
  </style>