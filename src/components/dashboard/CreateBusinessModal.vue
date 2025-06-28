<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const businessStore = useBusinessStore();
const { isLoading, error } = storeToRefs(businessStore);

// Estado local para los campos del formulario
const name = ref('');
const description = ref('');
const address = ref('');
const phone = ref('');

async function handleSubmit() {
  try {
    await businessStore.createBusiness({
      name: name.value,
      description: description.value,
      address: address.value,
      phone: phone.value,
    });
    // Si la creación es exitosa, el store se actualiza solo y cerramos el modal.
    emit('close');
  } catch (e) {
    // El error ya es manejado por el store y se mostrará en la UI.
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <h3 class="modal-title">Detalles de tu Negocio</h3>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="name">Nombre del Negocio</label>
          <input v-model="name" type="text" id="name" placeholder="Ej: Mi Restaurante Delicioso" required />
        </div>
        <div class="form-group">
          <label for="description">Descripción Corta</label>
          <textarea v-model="description" id="description" rows="3" placeholder="La mejor comida de la ciudad..." required></textarea>
        </div>
        <div class="form-group">
          <label for="address">Dirección</label>
          <input v-model="address" type="text" id="address" placeholder="Av. Siempre Viva 123" required />
        </div>
        <div class="form-group">
          <label for="phone">Teléfono de Contacto</label>
          <input v-model="phone" type="tel" id="phone" placeholder="0991234567" required />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="modal-actions">
          <button type="button" class="button-secondary" @click="emit('close')" :disabled="isLoading">Cancelar</button>
          <button type="submit" class="button-primary" :disabled="isLoading">
            {{ isLoading ? 'Creando...' : 'Crear Mi Negocio' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($BAKANO-DARK, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-card {
  background: $white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.modal-title {
    font-family: $font-principal;
    font-size: 1.8rem;
    color: $BAKANO-DARK;
    text-align: center;
    margin-bottom: 2rem;
}

// Estilos de formulario (similares a los de auth)
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

  input, textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid darken($BAKANO-LIGHT, 10%);
    border-radius: 8px;
    font-size: 1rem;
    font-family: $font-secondary;
    transition: border-color 0.3s, box-shadow 0.3s;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: $BAKANO-PINK;
      box-shadow: 0 0 0 3px rgba($BAKANO-PINK, 0.2);
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-family: $font-principal;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .button-primary {
    background: $BAKANO-PINK;
    color: $white;
    &:hover:not(:disabled) {
        background: darken($BAKANO-PINK, 10%);
    }
    &:disabled {
        background: darken($BAKANO-LIGHT, 15%);
        cursor: not-allowed;
    }
  }
  
  .button-secondary {
    background: $BAKANO-LIGHT;
    color: $BAKANO-DARK;
    &:hover:not(:disabled) {
        background: darken($BAKANO-LIGHT, 10%);
    }
  }
}
</style>