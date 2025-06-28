<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import router from '@/router';
import useAuthStore from '@/stores/auth.store';

// 1. Conexión con el store
const authStore = useAuthStore();
const { isLoading, error } = storeToRefs(authStore);

// 2. Estado local para todos los campos del formulario de registro
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// 3. Lógica de envío del formulario
async function handleSubmit() {
  // Validación de contraseña
  if (password.value !== passwordConfirm.value) {
    authStore.error = 'Las contraseñas no coinciden.';
    return;
  }

  // Validación de campos
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    authStore.error = 'Por favor, completa todos los campos.';
    return;
  }

  try {
    // 4. Llamamos a una nueva acción 'register' en nuestro store
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });
    // El store se encargará de redirigir si el registro es exitoso
  } catch (e) {
    // El error ya se maneja en el store, aquí solo evitamos que la promesa falle silenciosamente
  }
}

// 5. Limpieza del error
onUnmounted(() => {
  authStore.error = null;
});
</script>

<template>
  <div class="auth-container">
    <div class="auth-form-card">
      <h2 class="form-title">Crea tu Cuenta</h2>
      <p class="form-subtitle">Únete y empieza a gestionar tu negocio de forma eficiente.</p>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group-inline">
          <div class="form-group">
            <label for="firstName">Nombre</label>
            <input id="firstName" v-model="firstName" type="text" placeholder="John" required :disabled="isLoading"/>
          </div>
          <div class="form-group">
            <label for="lastName">Apellido</label>
            <input id="lastName" v-model="lastName" type="text" placeholder="Doe" required :disabled="isLoading"/>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input id="email" v-model="email" type="email" placeholder="tu@email.com" required :disabled="isLoading"/>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" required :disabled="isLoading"/>
        </div>

        <div class="form-group">
          <label for="passwordConfirm">Confirmar Contraseña</label>
          <input id="passwordConfirm" v-model="passwordConfirm" type="password" placeholder="••••••••" required :disabled="isLoading"/>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Creando cuenta...' : 'Registrarme' }}
        </button>
      </form>

      <p class="auth-switch">
        ¿Ya tienes una cuenta? 
        <router-link to="/login">Inicia sesión</router-link>
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
  padding: 2rem 0;
  font-family: $font-secondary;
}

.auth-form-card {
  background: $white;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba($BAKANO-DARK, 0.05);
  width: 100%;
  max-width: 480px; // Un poco más ancho para el registro
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

// Estilo específico para los campos Nombre y Apellido
.form-group-inline {
  display: flex;
  gap: 1.5rem;
  width: 100%;

  .form-group {
    flex: 1;
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

.error-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: left;
  background-color: rgba($BAKANO-PINK, 0.1);
  color: darken($BAKANO-PINK, 15%);
  border: 1px solid rgba($BAKANO-PINK, 0.2);
}
</style>