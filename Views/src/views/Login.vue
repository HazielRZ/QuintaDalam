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
              type="email"
              placeholder="admin@quintadalam.com"
              required
              :disabled="cargando"
          >
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="cargando"
          >
        </div>

        <div v-if="mensajeError" class="error-msg">
          ⚠️ {{ mensajeError }}
        </div>

        <div class="form-actions" style="margin-top: 1.5rem;">
          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;" :disabled="cargando">
            {{ cargando ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <div style="text-align: center; margin-top: 2rem;">
        <RouterLink class="btn-back" to="/">&larr; Volver al inicio</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const mensajeError = ref('');
const cargando = ref(false);

const procesarLogin = async () => {
  mensajeError.value = '';
  cargando.value = true;

  try {
    const respuesta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      localStorage.setItem('token_dalam', datos.token);
      router.push('/admin');
    } else {
      mensajeError.value = datos.error || 'Credenciales inválidas';
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
  border: 1.5px solid #ddd;
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