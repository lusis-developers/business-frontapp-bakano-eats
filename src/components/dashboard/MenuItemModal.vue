<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';
import type { IDish, IDrink } from '@/types/models/IBusiness';

const props = defineProps<{
  isOpen: boolean;
  itemType: 'dish' | 'drink' | null;
  itemToEdit?: IDish | IDrink | null;
}>();

const emit = defineEmits(['close']);

const businessStore = useBusinessStore();
const menuStore = useMenuStore();
const { business } = storeToRefs(businessStore);
const { isLoading, error } = storeToRefs(menuStore);

// --- ESTADO LOCAL DEL FORMULARIO ---
const name = ref('');
const description = ref('');
const price = ref<number | undefined>();
const category = ref('');
const size = ref(''); // Estado para el tamaño de la bebida

const isEditMode = computed(() => !!props.itemToEdit);

// Watcher mejorado para manejar ambos tipos de item
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    menuStore.error = null;
    if (isEditMode.value && props.itemToEdit) {
      name.value = props.itemToEdit.name;
      description.value = props.itemToEdit.description;
      price.value = props.itemToEdit.price;
      if ('category' in props.itemToEdit) {
        category.value = props.itemToEdit.category;
      }
      // Poblamos el tamaño si estamos editando una bebida
      if (props.itemType === 'drink' && 'size' in props.itemToEdit) {
        size.value = props.itemToEdit.size || '';
      }
    } else {
      // Limpiamos todo al crear un nuevo item
      name.value = '';
      description.value = '';
      price.value = undefined;
      category.value = '';
      size.value = '';
    }
  }
});

// --- HANDLE SUBMIT INTELIGENTE ---
async function handleSubmit() {
  if (!business.value) return;

  // Lógica para PLATILLOS
  if (props.itemType === 'dish') {
    const payload = {
      name: name.value,
      description: description.value,
      price: price.value ?? 0,
      category: category.value as 'Entrante' | 'Plato Fuerte' | 'Postre' | 'Sopa',
    };
    if (isEditMode.value && props.itemToEdit) {
      await menuStore.updateDish(business.value._id, props.itemToEdit._id, payload);
    } else {
      await menuStore.addDish(business.value._id, payload);
    }
  }
  // Lógica para BEBIDAS
  else if (props.itemType === 'drink') {
    const payload = {
      name: name.value,
      description: description.value,
      price: price.value ?? 0,
      category: category.value as 'Gaseosa' | 'Jugo Natural' | 'Bebida Energética' | 'Licor',
      size: size.value,
    };
    if (isEditMode.value && props.itemToEdit) {
      await menuStore.updateDrink(business.value._id, props.itemToEdit._id, payload);
    } else {
      await menuStore.addDrink(business.value._id, payload);
    }
  }

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
          <h3 class="modal-title">{{ isEditMode ? 'Editar' : 'Añadir' }} {{ itemType === 'dish' ? 'Platillo' : 'Bebida' }}</h3>
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="form-group">
              <label for="name">Nombre</label>
              <input v-model="name" type="text" required />
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea v-model="description" rows="3" required></textarea>
            </div>
            <div class="form-group-inline">
              <div class="form-group">
                <label for="price">Precio ($)</label>
                <input v-model.number="price" type="number" step="0.01" required />
              </div>
              
              <div v-if="itemType === 'dish'" class="form-group">
                <label for="category-dish">Categoría</label>
                <select v-model="category" id="category-dish" required>
                  <option disabled value="">Seleccione una...</option>
                  <option>Entrante</option>
                  <option>Plato Fuerte</option>
                  <option>Postre</option>
                  <option>Sopa</option>
                </select>
              </div>

              <div v-if="itemType === 'drink'" class="form-group">
                <label for="category-drink">Categoría</label>
                <select v-model="category" id="category-drink" required>
                  <option disabled value="">Seleccione una...</option>
                  <option>Gaseosa</option>
                  <option>Jugo Natural</option>
                  <option>Bebida Energética</option>
                  <option>Licor</option>
                </select>
              </div>
            </div>
            
            <div v-if="itemType === 'drink'" class="form-group">
              <label for="size">Tamaño (Opcional)</label>
              <input v-model="size" type="text" id="size" placeholder="Ej: 300ml, 1L" />
            </div>

            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" class="button-secondary" @click="emit('close')" :disabled="isLoading">Cancelar</button>
              <button type="submit" class="button-primary" :disabled="isLoading">
                {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Añadir') }}
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