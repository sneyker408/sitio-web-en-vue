<template>
	<div class="home">
		<div class="row mx-0">
			<div class="col-lg-6">
				<div class="Introduccion">
					<img class="logo" src="../assets/img/LogoVue.png" alt="Logo">
					<h1 id="TituloAbsoluto" class="text-center text-lg-start">SCAMSTORE</h1>
					<h1 id="Subtitulo" class="text-center text-lg-start " style="text-align: justify; max-width: 100%;">Conéctate con tus amigos y el resto del mundo usando ScamStore
					</h1>
				</div>
			</div>
			<div class="col-lg-6">
				<card-comp :btns="btnArray" class="mx-auto card-comp">
					<template #default>
						<form @submit.prevent="handleSubmit">
							<div class="mb-3 mt-2">
								<input
									v-model="email"
									type="email"
									class="form-control"
									placeholder="Ingresa tu email" />
							</div>
							<div class="mb-3 mt-2">
								<input
									v-model="password"
									type="password"
									class="form-control"
									placeholder="Contraseña" />
							</div>
						</form>
					</template>
					<!-- <template v-slot:footer>
						<hr />
						<button @click="loginGoogle" class="btn-google">
							
							<span >Continuar con Google</span>
							<img src="" alt="">
						</button>
					</template> -->
				
				</card-comp>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router' // Importamos useRouter
import CardComp from '../components/CardComp.vue'

export default {
	components: {
		CardComp,
	},
	setup() {
		const btnArray = ref([
			{
				txt: 'Iniciar sesión',
				class: 'btn-danger',
				// class: 'btn-primary',
				// class: 'btn-danger',
				// class: 'btn-dark',
				// class: 'btn-success',
				// class: 'btn-warning',
			},
			{
				txt: '¿Has olvidado tu contraseña?',
				class: '',
			},
			{
				txt: 'Registrarse',
				class: 'btn-dark',
			},
		])

		const googleProvider = new GoogleAuthProvider()
		const auth = getAuth()
		const router = useRouter() // Inicializamos router
		

		const loginGoogle = async () => {
			try {
				await signInWithPopup(auth, googleProvider)
				alert('¡Inicio de sesión exitoso!')

				// Redirigir automáticamente a /posts después del login
				router.push('/posts')
			} catch (error) {
				console.error('Error al iniciar sesión:', error)
				alert('Fallo en el inicio de sesión')
			}
		}

		return {
			btnArray,
			loginGoogle,
		}
	},
}
</script>

<style scoped>

/* ========== Subtitulos ============= */
.logo {
	margin-top: 1rem;
	width: 8rem;
	height: auto;
	margin: 0;
	animation: levitar 3s ease-in-out infinite;
}

	@keyframes levitar {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0);
		}
	}

.Introduccion {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	margin: 0;
}

#TituloAbsoluto {
	color: red;
	font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	font-size: 50px;
}

#Subtitulo {
	text-align: justify !important;
    max-width: 80% !important;
}

h2 {
	max-width: 470px;
	margin: auto;
	font-size: 1.8rem;
}

.home {
	max-width: 895px;
	margin: auto;
}


img {
	max-width: 315px;
	margin: 1em auto 0 auto;
}

.card-comp {
	max-width: 398px;
}

/* Estilo del botón de Google */


.btn-google img {
	width: 30px;
	height: 30px;
}

.btn-google:hover {
	background-color: #f7f7f7;
}

@media (min-width: 992px) {
	.home {
		margin: 4em auto;
	}

	img {
		margin: 0;
		margin-top: 5.6em;
	}

	h2 {
		margin: 0;
		margin-top: -0.8em;
		margin-left: 0.8em;
	}

	.card-comp {
		margin-top: 3rem;
	}
}
</style>
