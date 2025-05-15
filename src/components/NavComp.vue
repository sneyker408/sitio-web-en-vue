<template>
	<nav class="navbar">
	  <div class="nav-container">
		<!-- Logo/Brand -->
		<router-link to="/" class="nav-brand">
		  <img src="../assets/img/logo.png" alt="ScamStore" class="logo">
		  <span class="brand-name">ScamStore</span>
		</router-link>
  
		<!-- Main Navigation -->
		<div class="nav-links">
		  <router-link 
			to="/" 
			class="nav-link" 
			:class="{ active: activePath.home }"
			aria-label="Inicio"
		  >
			<span class="material-icons-round">home</span>
			<span class="link-text">Inicio</span>
		  </router-link>
  
		  <router-link 
			to="/about" 
			class="nav-link" 
			:class="{ active: activePath.about }"
			aria-label="Acerca de"
		  >
			<span class="material-icons-round">info</span>
			<span class="link-text">Acerca</span>
		  </router-link>
  
		  <router-link 
			to="/posts" 
			class="nav-link" 
			:class="{ active: activePath.posts }"
			aria-label="Publicaciones"
		  >
			<span class="material-icons-round">featured_play_list</span>
			<span class="link-text">Posts</span>
		  </router-link>
		</div>
  
		<!-- User Section -->
		<div class="user-section" v-if="user">
		  <router-link to="/profile" class="user-avatar">
			<img :src="user.photoURL || defaultAvatar" alt="Usuario">
		  </router-link>
		</div>
		<div class="auth-buttons" v-else>
		  <router-link to="/login" class="login-btn">Iniciar sesión</router-link>
		</div>
	  </div>
	</nav>
  </template>
  
  <script>
  import { getAuth } from 'firebase/auth'
  
  export default {
	name: 'NavComp',
	data() {
	  return {
		defaultAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
		user: null
	  }
	},
	computed: {
	  activePath() {
		const path = this.$route.path
		return {
		  home: path === '/',
		  about: path === '/about',
		  posts: path === '/posts'
		}
	  }
	},
	mounted() {
	  const auth = getAuth()
	  auth.onAuthStateChanged(user => {
		this.user = user
	  })
	}
  }
  </script>
  
  <style scoped>
  .navbar {
	background-color: #d11a2a; /* Rojo principal */
	height: 60px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	position: sticky;
	top: 0;
	z-index: 1000;
	width: 100%;
  }
  
  .nav-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
  }
  
  .nav-brand {
	display: flex;
	align-items: center;
	text-decoration: none;
	gap: 10px;
  }
  
  .logo {
	height: 36px;
	width: auto;
  }
  
  .brand-name {
	color: white;
	font-weight: bold;
	font-size: 1.2rem;
  }
  
  .nav-links {
	display: flex;
	gap: 15px;
	height: 100%;
  }
  
  .nav-link {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.8);
	text-decoration: none;
	padding: 0 15px;
	height: 100%;
	position: relative;
	transition: all 0.3s ease;
  }
  
  .nav-link:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
  }
  
  .nav-link.active {
	color: white;
  }
  
  .nav-link.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 3px;
	background-color: white;
  }
  
  .material-icons-round {
	font-size: 1.5rem;
  }
  
  .link-text {
	font-size: 0.75rem;
	margin-top: 2px;
  }
  
  .user-section, .auth-buttons {
	display: flex;
	align-items: center;
  }
  
  .user-avatar img {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	object-fit: cover;
	border: 2px solid white;
  }
  
  .login-btn {
	color: white;
	text-decoration: none;
	padding: 8px 16px;
	border-radius: 20px;
	background-color: rgba(255, 255, 255, 0.2);
	transition: background-color 0.3s;
  }
  
  .login-btn:hover {
	background-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
	.brand-name {
	  display: none;
	}
	
	.nav-links {
	  gap: 5px;
	}
	
	.link-text {
	  display: none;
	}
	
	.nav-link {
	  padding: 0 10px;
	}
  }
  </style>