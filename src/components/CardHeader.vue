<template>
	<div class="card-header">
	  <div class="row">
		<div class="col-2 col-sm-1">
		  <img
			class="avatar-img"
			:src="header.picture"
			alt="Avatar"
		  />
		</div>
		<div class="col-8 col-sm-9">
		  <h4 class="card-header-title m-0">
			<router-link to="/profile">
			  {{ header.name }}
			</router-link>
		  </h4>
		  <small class="text-muted card-header-subTitle">{{ formattedTime }}</small>
		</div>
		<div class="col-1">
		  <button class="btn d-flex align-items-center more-btn">
			<span class="material-icons-round"> more_horiz </span>
		  </button>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	name: 'CardHeader',
	props: ['header'],
	data() {
	  return {
		formattedTime: '',
		interval: null
	  }
	},
	mounted() {
	  this.updateTime()
	  this.interval = setInterval(this.updateTime, 60000) // Actualiza cada minuto
	},
	beforeUnmount() {
	  clearInterval(this.interval)
	},
// En CardHeader.vue (ya lo tienes implementado)
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

    // ... resto de la lógica de formato ...
  } catch (error) {
    console.error("Error formateando fecha:", error);
    this.formattedTime = "Fecha desconocida";
  }
}
  }
  </script>
  
  <!-- Mantén exactamente los mismos estilos que ya tienes -->
  <style scoped>
  .card-header {
	background-color: transparent;
	padding: 0.5rem 1rem;
	padding-bottom: 0;
	border-bottom: none;
  }
  
  .avatar-img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	border-radius: 50%;
  }
  
  .card-header-subTitle {
	font-size: 0.8em;
  }
  
  .card-header-title {
	line-height: 0.7;
  }
  
  .more-btn {
	border-radius: 50%;
	padding: 0.5em;
	margin: 0.3em;
  }
  
  @media (min-width: 576px) {
	.card-header .col-8 {
	  margin-left: 1em;
	}
  }
  </style>