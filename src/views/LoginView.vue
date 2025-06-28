<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAuthStore from '@/stores/auth.store';

// 1. Conectamos con el store de autenticación
const authStore = useAuthStore();

// 2. Usamos storeToRefs para mantener la reactividad en el estado del store
const { isLoading, error } = storeToRefs(authStore);

// 3. Estado local para los campos del formulario
const email = ref('');
const password = ref('');

// 4. Lógica para manejar el envío del formulario
async function handleSubmit() {
  if (!email.value || !password.value) {
    // Validación básica
    authStore.error = 'Por favor, completa todos los campos.';
    return;
  }
  await authStore.login({ email: email.value, password: password.value });
}

// 5. Verificamos si venimos de un registro exitoso para mostrar un mensaje
const route = useRoute();
const showSuccessMessage = computed(() => route.query.registered === 'true');

// 6. Limpiamos el error cuando el componente se destruye
onUnmounted(() => {
  authStore.error = null;
});
</script>

<template>
  <div class="auth-container">
    <div class="auth-form-card">
      <h2 class="form-title">Iniciar Sesión</h2>
      <p class="form-subtitle">Bienvenido de nuevo. Ingresa a tu panel de control.</p>

      <div v-if="showSuccessMessage" class="success-message">
        ¡Registro exitoso! Ahora puedes iniciar sesión.
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="tu@email.com" 
            required 
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="auth-switch">
        ¿No tienes una cuenta? 
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $BAKANO-LIGHT;
  font-family: $font-secondary;
}

.auth-form-card {
  background: $white;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba($BAKANO-DARK, 0.05);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.form-title {
  font-family: $font-principal;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: $BAKANO-DARK;
}

.form-subtitle {
  margin-bottom: 2rem;
  color: rgba($BAKANO-DARK, 0.7);
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: $BAKANO-DARK;
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid darken($BAKANO-LIGHT, 10%);
    border-radius: 8px;
    font-size: 1rem;
    font-family: $font-secondary;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      outline: none;
      border-color: $BAKANO-PINK;
      box-shadow: 0 0 0 3px rgba($BAKANO-PINK, 0.2);
    }
  }
}

.submit-button {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  background-color: $BAKANO-PINK;
  color: $white;
  font-family: $font-principal;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: darken($BAKANO-PINK, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba($BAKANO-PINK, 0.2);
  }

  &:disabled {
    background-color: darken($BAKANO-LIGHT, 15%);
    cursor: not-allowed;
  }
}

.auth-switch {
  margin-top: 2rem;
  color: rgba($BAKANO-DARK, 0.8);

  a {
    color: $BAKANO-PINK;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message,
.success-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: left;
}

.error-message {
  background-color: rgba($BAKANO-PINK, 0.1);
  color: darken($BAKANO-PINK, 15%);
  border: 1px solid rgba($BAKANO-PINK, 0.2);
}

.success-message {
  background-color: rgba($BAKANO-GREEN, 0.1);
  color: darken($BAKANO-GREEN, 15%);
  border: 1px solid rgba($BAKANO-GREEN, 0.2);
}
</style>