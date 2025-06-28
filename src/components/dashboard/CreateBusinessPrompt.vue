<script setup lang="ts">
import { ref } from 'vue';
import useAuthStore from '@/stores/auth.store';

import CreateBusinessModal from './CreateBusinessModal.vue';

const authStore = useAuthStore();

const user = authStore.user;

const isModalOpen = ref(false);
</script>

<template>
  <div class="prompt-container">
    <div class="content">
      <h1 class="welcome-title">
        ¡Bienvenido, {{ user?.firstName }}!
      </h1>
      <p class="welcome-subtitle">
        Estás a un solo paso de empezar a revolucionar la gestión de tu negocio.
      </p>
      <div class="cta-card">
        <h2>Registra tu Negocio</h2>
        <p>Crea tu perfil de negocio para activar tu menú digital, recibir órdenes y acceder a todas las herramientas de gestión.</p>
        <button class="cta-button" @click="isModalOpen = true">
          Comenzar ahora
        </button>
      </div>
    </div>
    
    <CreateBusinessModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.prompt-container {
  padding: 3rem;
  max-width: 800px;
  margin: 4rem auto;
  text-align: center;
}

.welcome-title {
  font-family: $font-principal;
  font-size: 3rem;
  font-weight: 700;
  color: $BAKANO-DARK;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: rgba($BAKANO-DARK, 0.7);
  margin-bottom: 3rem;
  font-family: $font-secondary;
}

.cta-card {
  background: $white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba($BAKANO-DARK, 0.07);

  h2 {
    font-family: $font-principal;
    font-size: 2rem;
    color: $BAKANO-PINK;
    margin-bottom: 1rem;
  }

  p {
    font-family: $font-secondary;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.cta-button {
  background: $BAKANO-PINK;
  color: $white;
  border: none;
  padding: 1rem 2.5rem;
  font-family: $font-principal;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($BAKANO-PINK, 10%);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba($BAKANO-PINK, 0.3);
  }
}
</style>