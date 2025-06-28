<script setup lang="ts">
/**
 * Este componente no tiene lógica propia.
 * Simplemente emite eventos para que el componente padre decida qué hacer.
 * Esta es una práctica excelente para mantener los componentes desacoplados.
 */
const emit = defineEmits(['add-dish', 'add-drink']);
</script>

<template>
  <div class="prompt-container">
    <div class="icon-wrapper">
      <i class="fas fa-magic"></i>
    </div>
    <h2 class="prompt-title">¡Estás en la recta final!</h2>
    <p class="prompt-subtitle">
      Tu perfil de negocio está configurado. El último paso para empezar a vender es darle vida a tu menú.
    </p>
    <div class="prompt-actions">
      <button @click="emit('add-dish')" class="action-button dish">
        <i class="fas fa-utensils"></i>
        Añadir mi primer platillo
      </button>
      <button @click="emit('add-drink')" class="action-button drink">
        <i class="fas fa-cocktail"></i>
        Añadir mi primera bebida
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.prompt-container {
  background: linear-gradient(135deg, lighten($BAKANO_PURPLE, 42%), lighten($BAKANO-PINK, 43%));
  border: 1px solid rgba($BAKANO_PURPLE, 0.2);
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 16px;
  margin: 2rem 0;
}

.icon-wrapper {
  font-size: 3rem;
  color: $BAKANO_PURPLE;
  margin-bottom: 1rem;
}

.prompt-title {
  font-family: $font-principal;
  font-size: 2.5rem;
  color: $BAKANO-DARK;
}

.prompt-subtitle {
  font-family: $font-secondary;
  font-size: 1.2rem;
  color: rgba($BAKANO_DARK, 0.8);
  max-width: 600px;
  margin: 0.5rem auto 2.5rem;
}

.prompt-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.action-button {
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-family: $font-principal;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &.dish {
    background: $BAKANO-PINK;
    color: $white;
  }

  &.drink {
    background: $BAKANO_PURPLE;
    color: $white;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba($BAKANO_DARK, 0.1);
  }
}
</style>