<template>
	<div class="home">
		<div class="row mx-0">
			<div class="col-lg-6">
				<div class="img-cont">
					<img alt="Vue logo" src="../assets/img/wordmark.svg" />
					<h2 class="text-center text-lg-start">
						Conéctate con amigos y el resto del mundo usando Mazebook
					</h2>
				</div>
			</div>
			<div class="col-lg-6">
				<card-comp :btns="btnArray" class="mx-auto card-comp">
					<template #default>
						<form>
							<div class="mb-3 mt-2">
								<input
									type="email"
									class="form-control"
									placeholder="Ingresa tu email" />
							</div>
							<div class="mb-3 mt-2">
								<input
									type="password"
									class="form-control"
									placeholder="Contraseña" />
							</div>
						</form>
					</template>
					<template v-slot:footer>
						<hr />
						<button @click="loginGoogle" class="btn-google">
							
							<span >Continuar con Google</span>
							<img src="" alt="">
						</button>
					</template>
				</card-comp>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router' // ✅ Importamos useRouter
import CardComp from '../components/CardComp.vue'

export default {
	components: {
		CardComp,
	},
	setup() {
		const btnArray = ref([
			{
				txt: 'Iniciar sesión',
				class: 'btn-primary',
			},
			{
				txt: '¿Has olvidado tu contraseña?',
				class: '',
			},
		])

		const googleProvider = new GoogleAuthProvider()
		const auth = getAuth()
		const router = useRouter() // ✅ Inicializamos router

		const loginGoogle = async () => {
			try {
				await signInWithPopup(auth, googleProvider)
				alert('¡Inicio de sesión exitoso!')

				// ✅ Redirigir automáticamente a /posts después del login
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
h2 {
	max-width: 470px;
	margin: auto;
	font-size: 1.8rem;
}

.home {
	max-width: 895px;
	margin: auto;
}

.img-cont {
	display: flex;
	flex-direction: column;
}

img {
	max-width: 315px;
	margin: 1em auto 0 auto;
}

.card-comp {
	max-width: 398px;
}

/* ✅ Estilo del botón de Google */


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
