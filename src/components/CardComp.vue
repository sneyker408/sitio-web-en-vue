<template>
	<div class="card post-container">
	  <!-- Cabecera con avatar -->
	  <div class="post-header">
		<img 
		  :src="header.picture || defaultAvatar" 
		  class="post-avatar"
		  alt="Avatar"
		>
		<div class="post-user">
		  <span class="username">{{ header.name }}</span>
		  <span class="post-time">{{ formattedTime }}</span>
		</div>
	  </div>
  
	  <!-- Contenido del post -->
	  <p class="post-content">{{ parrafo }}</p>
	  
	  <!-- Contenedor de imagen -->
	  <div v-if="picture" class="image-container">
		<img :src="picture" class="post-image" :style="imageStyle">
	  </div>
	  
	  <!-- Contador de likes -->
	  <div v-if="likesCount > 0" class="likes-counter">
		{{ likesCount }} me gusta
	  </div>
	  
	  <!-- Botones de interacción -->
	  <div class="interaction-buttons">
		<button @click="toggleLike" :class="{ 'active': isLiked }">
		  <span class="material-icons">{{ isLiked ? 'thumb_up' : 'thumb_up_off_alt' }}</span>
		  Me gusta
		</button>
		<button @click="toggleComments">
		  <span class="material-icons">chat_bubble_outline</span>
		  Comentar
		</button>
		<button @click="sharePost">
		  <span class="material-icons">share</span>
		  Compartir
		</button>
	  </div>
  
	  <!-- Sección de comentarios -->
	  <div v-if="showComments" class="comments-section">
		<div class="comment-input">
		  <img :src="currentUserPhoto" class="user-avatar">
		  <input 
			v-model="newComment"
			placeholder="Escribe un comentario..."
			@keyup.enter="addComment"
		  >
		</div>
		
		<div class="comments-list">
		  <div v-for="(comment, index) in comments" :key="index" class="comment">
			<img :src="comment.userPhoto || defaultAvatar" class="user-avatar">
			<div class="comment-content">
			  <strong>{{ comment.userName }}</strong>
			  <p>{{ comment.text }}</p>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore';
  import { db } from '@/main';
  import { getAuth } from 'firebase/auth';
  
  
  export default {
	props: {
	  postId: String,
	  parrafo: String,
	  picture: String,
	  header: {
		type: Object,
		required: true,
		validator: (value) => {
		  return value.name && (value.timestamp instanceof Date || value.timestamp?.toDate || typeof value.timestamp === 'string')
		}
	  },
	  initialLikes: Number,
	  initialComments: Array
	},
	data() {
	  return {
		likesCount: this.initialLikes || 0,
		isLiked: false,
		showComments: false,
		comments: this.initialComments || [],
		newComment: '',
		defaultAvatar: 'https://randomuser.me/api/portraits/men/81.jpg',
		auth: getAuth(),
		imageStyle: {},
		formattedTime: 'Recién publicado'
	  }
	},
	computed: {
	  currentUserPhoto() {
		return this.auth.currentUser?.photoURL || this.defaultAvatar;
	  }
	},
	methods: {
	  async toggleLike() {
		if (!this.auth.currentUser) return alert('Inicia sesión para dar like');
		
		try {
		  const postRef = doc(db, 'posts', this.postId);
		  await updateDoc(postRef, {
			likes: increment(this.isLiked ? -1 : 1),
			likedBy: this.isLiked 
			  ? arrayRemove(this.auth.currentUser.uid) 
			  : arrayUnion(this.auth.currentUser.uid)
		  });
		  
		  this.isLiked = !this.isLiked;
		  this.likesCount += this.isLiked ? 1 : -1;
		} catch (error) {
		  console.error("Error al dar like:", error);
		}
	  },
	  async addComment() {
		if (!this.newComment.trim() || !this.auth.currentUser) return;
		
		try {
		  const comment = {
			userId: this.auth.currentUser.uid,
			userName: this.auth.currentUser.displayName || 'Anónimo',
			userPhoto: this.auth.currentUser.photoURL,
			text: this.newComment.trim(),
			date: new Date().toISOString()
		  };
		  
		  await updateDoc(doc(db, 'posts', this.postId), {
			comments: arrayUnion(comment)
		  });
		  
		  this.comments.unshift(comment);
		  this.newComment = '';
		} catch (error) {
		  console.error("Error al comentar:", error);
		}
	  },
	  toggleComments() {
		this.showComments = !this.showComments;
	  },
	  sharePost() {
		alert('Funcionalidad de compartir en desarrollo');
	  },
	  calculateImageStyle() {
		if (!this.picture) return {};
		const img = new Image();
		img.src = this.picture;
		img.onload = () => {
		  const ratio = img.width / img.height;
		  if (ratio > 1) {
			this.imageStyle = { width: '100%', height: 'auto' };
		  } else {
			this.imageStyle = { width: 'auto', height: '300px', 'max-width': '100%' };
		  }
		};
	  },
	  updateTime() {
		try {
		  let postDate;
		  
		  // Caso 1: Es un Timestamp de Firebase
		  if (this.header.timestamp?.toDate) {
			postDate = this.header.timestamp.toDate();
		  } 
		  // Caso 2: Es un objeto Date o string ISO válido
		  else if (this.header.timestamp) {
			postDate = new Date(this.header.timestamp);
		  } else {
			this.formattedTime = "Recién publicado";
			return;
		  }
  
		  // Validación extra
		  if (isNaN(postDate.getTime())) {
			this.formattedTime = "Fecha desconocida";
			return;
		  }
  
		  const now = new Date();
		  const diffInSeconds = Math.floor((now - postDate) / 1000);
  
		  if (diffInSeconds < 60) {
			this.formattedTime = "Ahora mismo";
		  } else if (diffInSeconds < 3600) {
			const mins = Math.floor(diffInSeconds / 60);
			this.formattedTime = `Hace ${mins} minuto${mins !== 1 ? 's' : ''}`;
		  } else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			this.formattedTime = `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
		  } else {
			this.formattedTime = postDate.toLocaleDateString('es-ES', {
			  day: 'numeric',
			  month: 'numeric',
			  year: 'numeric'
			});
		  }
		} catch (error) {
		  console.error("Error formateando fecha:", error);
		  this.formattedTime = "Fecha desconocida";
		}
	  }
	},
	mounted() {
	  this.calculateImageStyle();
	  this.updateTime();
	  if (this.auth.currentUser) {
		const postRef = doc(db, 'posts', this.postId);
		getDoc(postRef).then(snap => {
		  if (snap.exists()) {
			this.isLiked = snap.data().likedBy?.includes(this.auth.currentUser.uid) || false;
		  }
		});
	  }
	}
  }
  </script>
  
  <style scoped>
  /* Estilos base */
  .post-container {
	background: white;
	border-radius: 8px;
	margin-bottom: 16px;
	box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  /* Cabecera con avatar */
  .post-header {
	display: flex;
	align-items: center;
	padding: 12px 16px 8px;
  }
  
  .post-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 10px;
  }
  
  .username {
	font-weight: 600;
	display: block;
	color: #050505;
	font-size: 15px;
  }
  
  .post-time {
	font-size: 13px;
	color: #65676B;
  }
  
  /* Contenido del post */
  .post-content {
	padding: 0 16px 12px;
	margin: 0;
	font-size: 15px;
	line-height: 1.4;
	color: #050505;
  }
  
  /* Contador de likes */
  .likes-counter {
	padding: 8px 16px;
	color: #65676B;
	font-size: 13px;
	border-top: 1px solid #eee;
  }
  
  /* Botones de interacción */
  .interaction-buttons {
	display: flex;
	border-top: 1px solid #eee;
	padding: 6px 0;
  }
  
  .interaction-buttons button {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 8px;
	background: none;
	border: none;
	color: #65676B;
	font-weight: 600;
	cursor: pointer;
	border-radius: 4px;
	transition: background 0.2s;
	font-size: 14px;
  }
  
  .interaction-buttons button:hover {
	background: #f0f2f5;
  }
  
  .interaction-buttons .active {
	color: #1877F2;
  }
  
  /* Estilos para imágenes */
  .image-container {
	margin: 0 0 8px 0;
	padding: 0 16px;
  }
  
  .post-image {
	border-radius: 8px;
	max-width: 100%;
	max-height: 500px;
	object-fit: contain;
  }
  
  /* Sección de comentarios */
  .comments-section {
	border-top: 1px solid #eee;
	padding: 12px 16px 0;
  }
  
  .comment-input {
	display: flex;
	gap: 8px;
	margin-bottom: 12px;
	background: #f0f2f5;
	border-radius: 18px;
	padding: 8px;
  }
  
  .user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	object-fit: cover;
  }
  
  .comment-input input {
	flex: 1;
	padding: 8px 12px;
	border: none;
	background: transparent;
	border-radius: 18px;
	outline: none;
  }
  
  .comments-list {
	margin-top: 8px;
  }
  
  .comment {
	display: flex;
	gap: 8px;
	margin-bottom: 12px;
  }
  
  .comment-content {
	background: #F0F2F5;
	padding: 8px 12px;
	border-radius: 18px;
	max-width: 80%;
  }
  
  .comment-content p {
	margin: 4px 0 0;
	font-size: 14px;
  }
  </style>