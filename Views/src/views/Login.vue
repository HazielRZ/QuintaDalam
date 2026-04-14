<template>
  <div class="login-wrapper">
    <div class="card login-card">

      <div class="header-content" style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 10px;">Bienvenido</div>
        <h2>Acceso Administrativo</h2>
        <p class="subtitle">Hotel Quinta Dalam</p>
      </div>

      <form @submit.prevent="procesarLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
              id="email"
              v-model="email"
              :disabled="cargando"
              placeholder="admin@quintadalam.com"
              required
              type="email"
          >
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
              id="password"
              v-model="password"
              :disabled="cargando"
              placeholder="••••••••"
              required
              type="password"
          >
        </div>

        <div v-if="mensajeError" class="error-msg">
          ⚠️ {{ mensajeError }}
        </div>

        <div class="form-actions" style="margin-top: 1.5rem;">
          <button :disabled="cargando" class="btn-primary" style="width: 100%; justify-content: center;" type="submit">
            {{ cargando ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>
        </div>
        <div class="form-group" style="background: #f4f7fb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <label style="color: #082B59; font-weight: bold; margin-bottom: 10px;">
            🛡️ Verificación de Seguridad: ¿Cuánto es {{ captchaNum1 }} + {{ captchaNum2 }}?
          </label>
          <input
              v-model="captchaInput"
              type="number"
              placeholder="Respuesta"
              required
              style="width: 100%; text-align: center; font-size: 1.2rem;"
          >
        </div>
      </form>

      <div style="text-align: center; margin-top: 2rem;">
        <RouterLink class="btn-back" to="/">&larr; Volver al inicio</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const mensajeError = ref('');
const cargando = ref(false);

// Variables del CAPTCHA
const captchaNum1 = ref(0);
const captchaNum2 = ref(0);
const captchaInput = ref('');

// Generar Captcha al iniciar
onMounted(() => {
  generarCaptcha();
});

const generarCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 10) + 1;
  captchaNum2.value = Math.floor(Math.random() * 10) + 1;
  captchaInput.value = '';
};

// Función unificada
const procesarLogin = async () => {
  mensajeError.value = ''; // Limpiamos errores anteriores

  // 1. Validamos el CAPTCHA antes de tocar el servidor
  if (parseInt(captchaInput.value) !== (captchaNum1.value + captchaNum2.value)) {
    // Usamos mensajeError.value (no error.value)
    mensajeError.value = "CAPTCHA incorrecto. ¿Eres un bot 🤖?";
    generarCaptcha(); // Cambiamos los números si falla
    return; // El return detiene el código aquí para que no haga la petición
  }

  // 2. Si el CAPTCHA está bien, continuamos con el Login normal
  cargando.value = true;

  try {
    const respuesta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      localStorage.setItem('token_dalam', datos.token);
      await router.push('/admin');
    } else {
      mensajeError.value = datos.error || 'Credenciales inválidas';
      generarCaptcha(); // Opcional: Generar nuevo captcha si falla la contraseña
    }
  } catch (error) {
    console.error(error);
    mensajeError.value = 'Error al conectar con el servidor.';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
  box-sizing: border-box;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eaa4db 0%, #af257e 100%);
  padding: 20px;
  margin: 50px auto;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background: white;
  margin: 50px auto;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.85rem;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>