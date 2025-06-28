<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';

// --- PROPS Y EMITS ---
const props = defineProps<{
  isOpen: boolean;
  itemType: 'dish' | 'drink' | null; // Determina qué formulario mostrar
}>();

const emit = defineEmits(['close']);


// --- STORES ---
const businessStore = useBusinessStore();
const menuStore = useMenuStore();
const { business } = storeToRefs(businessStore);
// Obtenemos isLoading y error del menuStore, que es el encargado de estas acciones
const { isLoading, error } = storeToRefs(menuStore);


// --- ESTADO LOCAL DEL FORMULARIO ---
const name = ref('');
const description = ref('');
const price = ref<number | undefined>();
const category = ref('');
// const size = ref(''); // Para cuando implementemos las bebidas

// --- LÓGICA ---

// Un watcher profesional: limpia el formulario cada vez que se abre el modal.
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    name.value = '';
    description.value = '';
    price.value = undefined;
    category.value = '';
    menuStore.error = null; // Limpiamos cualquier error previo del store
  }
});

async function handleSubmit() {
  if (!business.value) return; // Guarda de seguridad

  if (props.itemType === 'dish') {
    await menuStore.addDish(business.value._id, {
      name: name.value,
      description: description.value,
      price: price.value ?? 0,
      category: category.value as any,
    });
  }
  // En el futuro:
  // else if (props.itemType === 'drink') {
  //   await menuStore.addDrink(...)
  // }

  // Si no hubo error en la acción del store, cerramos el modal.
  if (!error.value) {
    emit('close');
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-card">
          <h3 class="modal-title">Añadir Nuevo {{ itemType === 'dish' ? 'Platillo' : 'Bebida' }}</h3>
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="form-group">
              <label for="name">Nombre del Producto</label>
              <input v-model="name" type="text" id="name" placeholder="Ej: Lomo Saltado" required />
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea v-model="description" id="description" rows="3" placeholder="Jugosos trozos de lomo con..." required></textarea>
            </div>
            <div class="form-group-inline">
              <div class="form-group">
                <label for="price">Precio ($)</label>
                <input v-model.number="price" type="number" step="0.01" id="price" placeholder="0.00" required />
              </div>
              <div v-if="itemType === 'dish'" class="form-group">
                <label for="category">Categoría</label>
                <select v-model="category" id="category" required>
                  <option disabled value="">Seleccione una...</option>
                  <option>Entrante</option>
                  <option>Plato Fuerte</option>
                  <option>Postre</option>
                  <option>Sopa</option>
                </select>
              </div>
            </div>
            
            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" class="button-secondary" @click="emit('close')" :disabled="isLoading">Cancelar</button>
              <button type="submit" class="button-primary" :disabled="isLoading">
                {{ isLoading ? 'Guardando...' : 'Añadir al Menú' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

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
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-family: $font-principal;
  font-size: 1.8rem;
  color: $BAKANO-DARK;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid darken($BAKANO-LIGHT, 10%);
    border-radius: 8px;
    font-size: 1rem;
    font-family: $font-secondary;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: $BAKANO-PINK;
      box-shadow: 0 0 0 3px rgba($BAKANO-PINK, 0.2);
    }
  }
}

.form-group-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
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
    transition: all 0.2s;
  }

  .button-primary {
    background: $BAKANO-PINK;
    color: $white;

    &:hover:not(:disabled) {
      background: darken($BAKANO-PINK, 10%);
    }
  }

  .button-secondary {
    background: $BAKANO-LIGHT;
    color: $BAKANO-DARK;

    &:hover:not(:disabled) {
      background: darken($BAKANO-LIGHT, 10%);
    }
  }

  button:disabled {
    background: darken($BAKANO-LIGHT, 5%);
    color: rgba($BAKANO-DARK, 0.5);
    cursor: not-allowed;
  }
}
</style>