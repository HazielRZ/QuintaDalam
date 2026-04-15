<template>
  <div class="login-wrapper">
    <div class="login-card">

      <div class="logo-ring">
        <div class="logo-inner">Q</div>
      </div>

      <h1>Bienvenido</h1>
      <p class="subtitle">Hotel Quinta Dalam</p>

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

        <div class="captcha-box">
          <label>Verificación de seguridad — ¿Cuánto es {{ captchaNum1 }} + {{ captchaNum2 }}?</label>
          <input
              v-model="captchaInput"
              type="number"
              placeholder="Respuesta"
              required
          >
        </div>

        <div v-if="mensajeError" class="error-msg">
          <span>⚠</span> {{ mensajeError }}
        </div>

        <button :disabled="cargando" class="btn-primary" type="submit">
          {{ cargando ? 'Verificando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <div class="footer">
        <RouterLink class="btn-back" to="/">&#8592; Volver al inicio</RouterLink>
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

const captchaNum1 = ref(0);
const captchaNum2 = ref(0);
const captchaInput = ref('');

onMounted(() => {
  generarCaptcha();
});

const generarCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 10) + 1;
  captchaNum2.value = Math.floor(Math.random() * 10) + 1;
  captchaInput.value = '';
};

const procesarLogin = async () => {
  mensajeError.value = '';

  if (parseInt(captchaInput.value) !== (captchaNum1.value + captchaNum2.value)) {
    mensajeError.value = "CAPTCHA incorrecto. ¿Eres un bot?";
    generarCaptcha();
    return;
  }

  cargando.value = true;

  try {
    const respuesta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      localStorage.setItem('token_dalam', datos.token);
      await router.push('/admin');
    } else {
      mensajeError.value = datos.error || 'Credenciales inválidas';
      generarCaptcha();
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
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(150deg, #F9A8E3 0%, #FCD6F3 45%, #f26bce 100%);
  padding: 24px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
}

.logo-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #FBEAF0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 2px solid #ED93B1;
}

.logo-inner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f26bce, #f26bce);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

h1 {
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 12px;
  color: #f26bce;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: border 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border: 1.5px solid #f26bce;
}

.captcha-box {
  background: #FBEAF0;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.captcha-box label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
}

.captcha-box input {
  width: 100%;
  padding: 9px 14px;
  border: 1px solid #000000;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  font-family: inherit;
  background: white;
  color: #000000;
  box-sizing: border-box;
}

.captcha-box input:focus {
  outline: none;
  border: 1.5px solid #f26bce;
}

.error-msg {
  background: #FCEBEB;
  border: 1px solid #F09595;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #f26bce;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #f26bce, #f26bce);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 8px;
}

.btn-primary:hover {
  opacity: 0.92;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.btn-back {
  font-size: 13px;
  color: #000000;
  text-decoration: none;
  font-weight: 500;
}

.btn-back:hover {
  text-decoration: underline;
}
</style>