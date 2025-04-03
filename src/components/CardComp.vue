<template>
	<div class="card">
	  <CardHeader v-if="header" :header="header" />
	  <div class="card-body">
		<h5 v-if="title" class="card-title">{{ title }}</h5>
		<p v-if="parrafo" class="card-text mb-1">
		  {{ parrafo }}
		</p>
		<img v-if="picture" :src="picture" alt="post img" class="post-img" />
		<ListGroup v-if="likes" :postId="'9oQKlkSjvGaUPr4yKhSO'" /> <!-- ID AQUÍ -->
		<slot></slot>
		<div class="d-grid gap-2">
		  <button
			v-for="btn in btns"
			:key="btn.txt"
			class="btn"
			:class="btn.class">
			{{ btn.txt }}
		  </button>
		  <slot name="footer"></slot>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import CardHeader from './CardHeader.vue'
  import ListGroup from './ListGroup.vue'
  
  export default {
	components: { CardHeader, ListGroup },
	name: 'CardComp',
	props: {
	  title: String,
	  parrafo: String,
	  btns: Array,
	  picture: String,
	  header: Object,
	  likes: Boolean
	  // No necesitas recibir postId como prop porque está fijo
	}
  }
  </script>
  
  <style scoped>
	.post-img {
	max-width: 100%;
	}

	/* === Caja === */
  .card {
	position: relative;/* */
	border: none;
	box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
	overflow: hidden; /* */
  }


  /* .card::before {
	content: "";
	position: absolute;
	top: -50%;
	left: -50%;
	width: 380px;
	height: 105%;
	background: linear-gradient(0deg, transparent, rgb(0, 255, 255), rgb(0, 255, 255));
	transform-origin: bottom right;
	animation: animate 6s linear infinite;
	animation-delay: -3s;
  }

  .card::after {
	content: "";
	position: absolute;
	top: -50%;
	left: -50%;
	width: 380px;
	height: 105%;
	background: linear-gradient(0deg, transparent, rgb(0, 255, 255), rgb(0, 255, 255));
	transform-origin: bottom right;
	animation: animate 6s linear infinite;
  }

  @keyframes animate {
	0%
	{
		transform: rotate(0deg);
	}
	100%
	{
		transform: rotate(360deg);
	}
  } */

  


  
  </style>