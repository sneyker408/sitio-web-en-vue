<template>
	<ul class="list-group">
	  <!-- Contador de likes -->
	  <li v-if="likesCount > 0" class="list-group-item text-muted">
		A {{ likesCount }} personas les gusta esto
	  </li>
  
	  <!-- Botones Like y Comentar -->
	  <li class="list-group-item">
		<div class="row">
		  <!-- Botón Like -->
		  <div class="col d-grid">
			<button 
			  @click="toggleLike"
			  class="btn d-flex justify-content-center align-items-center gap-2 px-0"
			  :class="{ 'text-primary': isLiked }">
			  <span class="material-icons-round">thumb_up</span>
			  {{ isLiked ? 'Te gusta' : 'Me gusta' }}
			</button>
		  </div>
  
		  <!-- Botón Comentar -->
		  <div class="col d-grid">
			<button 
			  @click="showComments = !showComments"
			  class="btn d-flex justify-content-center align-items-center gap-2 px-0">
			  <span class="material-icons-round">chat_bubble_outline</span>
			  Comentar
			</button>
		  </div>
		</div>
	  </li>
  
	  <!-- Sección de Comentarios (aparece al hacer clic) -->
	  <li v-if="showComments" class="list-group-item">
		<!-- Campo para nuevo comentario -->
		<div class="mb-3">
		  <textarea 
			v-model="newComment"
			class="form-control" 
			placeholder="Escribe algo...">
		  </textarea>
		</div>
		<button 
		  @click="addComment"
		  class="btn btn-primary btn-sm">
		  Publicar
		</button>
  
		<!-- Lista de comentarios -->
		<div 
		  v-for="(comment, index) in comments" 
		  :key="index" 
		  class="mt-2 p-2 border-top">
		  <strong>{{ comment.userName }}</strong>: {{ comment.text }}
		</div>
	  </li>
	</ul>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { 
	doc, 
	updateDoc, 
	arrayUnion, 
	arrayRemove,
	increment,
	getDoc 
  } from 'firebase/firestore';
  import { db } from '@/main';
  import { getAuth } from 'firebase/auth';
  
  export default {
	props: {
	  postId: {  // Recibe el ID de la publicación como prop
		type: String,
		required: true
	  }
	},
	setup(props) {
	  // Datos reactivos
	  const likesCount = ref(0);
	  const isLiked = ref(false);
	  const showComments = ref(false);
	  const newComment = ref('');
	  const comments = ref([]);
	  const auth = getAuth();
  
	  // Cargar datos iniciales
	  const loadData = async () => {
		const postRef = doc(db, 'posts', props.postId);
		const postSnap = await getDoc(postRef);
		
		if (postSnap.exists()) {
		  const data = postSnap.data();
		  likesCount.value = data.likes || 0;
		  comments.value = data.comments || [];
		  
		  // Verificar si el usuario actual ya dio like
		  if (auth.currentUser && data.likedBy?.includes(auth.currentUser.uid)) {
			isLiked.value = true;
		  }
		}
	  };
  
	  // Dar o quitar like
	  const toggleLike = async () => {
		const user = auth.currentUser;
		if (!user) return alert('Inicia sesión para dar like');
		
		const postRef = doc(db, 'posts', props.postId);
		
		if (isLiked.value) {
		  // Quitar like
		  await updateDoc(postRef, {
			likes: increment(-1),
			likedBy: arrayRemove(user.uid)
		  });
		  likesCount.value--;
		} else {
		  // Dar like
		  await updateDoc(postRef, {
			likes: increment(1),
			likedBy: arrayUnion(user.uid)
		  });
		  likesCount.value++;
		}
		isLiked.value = !isLiked.value;
	  };
  
	  // Añadir comentario
	  const addComment = async () => {
		const user = auth.currentUser;
		if (!user) return alert('Inicia sesión para comentar');
		if (!newComment.value.trim()) return alert('Escribe un comentario');
		
		const comment = {
		  userName: user.displayName || 'Anónimo',
		  userId: user.uid,
		  text: newComment.value,
		  date: new Date().toISOString()
		};
  
		const postRef = doc(db, 'posts', props.postId);
		await updateDoc(postRef, {
		  comments: arrayUnion(comment)
		});
		
		comments.value.push(comment);
		newComment.value = ''; // Limpiar el campo
	  };
  
	  // Cargar datos al iniciar
	  onMounted(loadData);
  
	  return {
		likesCount,
		isLiked,
		showComments,
		newComment,
		comments,
		toggleLike,
		addComment
	  };
	}
  };
  </script>
  
  <style scoped>
  .btn:hover {
	background-color: rgba(0, 0, 0, 0.05);
  }
  .text-primary {
	color: #0d6efd !important;
  }
  </style>