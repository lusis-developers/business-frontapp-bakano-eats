<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';

// Componentes Reutilizables
import MenuItemCard from '@/components/menu/MenuItemCard.vue';
import type { IDish, IDrink } from '@/types/models/IBusiness';
import MenuItemModal from '@/components/dashboard/MenuItemModal.vue';
// Corregimos la ruta del modal para una mejor organización

// --- STORES ---
const businessStore = useBusinessStore();
const menuStore = useMenuStore();

const { business } = storeToRefs(businessStore);
const { dishes, drinks, isLoading } = storeToRefs(menuStore);

// --- LÓGICA DEL MODAL (AÑADIR Y EDITAR) ---
const isModalOpen = ref(false);
const itemTypeToAddOrEdit = ref<'dish' | 'drink' | null>(null);
const currentItemToEdit = ref<IDish | IDrink | null>(null); // <-- Estado para guardar el item a editar

// Función para abrir el modal en modo 'Añadir'
function openAddItemModal(type: 'dish' | 'drink') {
  currentItemToEdit.value = null; // Limpiamos el item a editar para asegurar el modo 'crear'
  itemTypeToAddOrEdit.value = type;
  isModalOpen.value = true;
}

// Función para abrir el modal en modo 'Editar'
function openEditItemModal(item: IDish | IDrink, type: 'dish' | 'drink') {
  currentItemToEdit.value = item; // Guardamos el item completo que queremos editar
  itemTypeToAddOrEdit.value = type;
  isModalOpen.value = true;
}

// --- LÓGICA DE ACCIONES (BORRAR) ---
function handleDeleteDish(dishId: string) {
  if (!business.value) return;
  const confirmation = confirm('¿Estás seguro de que quieres eliminar este platillo?');
  if (confirmation) {
    menuStore.deleteDish(business.value._id, dishId);
  }
}

function handleDeleteDrink(drinkId: string) {
  if (!business.value) return;
  const confirmation = confirm('¿Estás seguro de que quieres eliminar esta bebida?');
  if (confirmation) {
    // ANTES (comentado y solo con un console.log):
    // // menuStore.deleteDrink(business.value._id, drinkId); // Descomentar cuando la acción exista
    // console.log('Borrando bebida:', drinkId);

    // AHORA (CORRECTO Y ACTIVADO):
    // Llamamos a la acción deleteDrink que ya creamos en nuestro menu.store.
    menuStore.deleteDrink(business.value._id, drinkId);
  }
}

// --- DATA FETCHING ---
onMounted(() => {
  if (!business.value) {
    businessStore.fetchBusinessData().then(() => {
      if (business.value) {
        menuStore.fetchMenu(business.value._id);
      }
    });
  } else {
    menuStore.fetchMenu(business.value._id);
  }
});
</script>

<template>
  <main class="menu-wrapper">
    <header class="menu-header">
      <h1>Gestión de Menú</h1>
      <div class="header-actions">
        <button @click="openAddItemModal('dish')" class="action-button dish">
          <i class="fas fa-utensils"></i>
          <span>Añadir Platillo</span>
        </button>
        <button @click="openAddItemModal('drink')" class="action-button drink">
          <i class="fas fa-cocktail"></i>
          <span>Añadir Bebida</span>
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="loading-container">Cargando menú...</div>
    
    <div v-else class="menu-layout">
      <section>
        <h2>Platillos</h2>
        <div v-if="dishes.length > 0" class="items-grid">
          <MenuItemCard 
            v-for="dish in dishes" 
            :key="dish._id" 
            :item="dish"
            @delete="handleDeleteDish(dish._id)"
            @edit="openEditItemModal(dish, 'dish')"
          />
        </div>
        <div v-else class="empty-state">
          <p>No hay platillos en tu menú. ¡Añade el primero!</p>
        </div>
      </section>

      <section>
        <h2>Bebidas</h2>
        <div v-if="drinks.length > 0" class="items-grid">
          <MenuItemCard 
            v-for="drink in drinks" 
            :key="drink._id" 
            :item="drink"
            @delete="handleDeleteDrink(drink._id)"
            @edit="openEditItemModal(drink, 'drink')"
          />
        </div>
        <div v-else class="empty-state">
          <p>No hay bebidas en tu menú. ¡Añade la primera!</p>
        </div>
      </section>
    </div>

    <MenuItemModal
      :is-open="isModalOpen" 
      :item-type="itemTypeToAddOrEdit"
      :item-to-edit="currentItemToEdit"
      @close="isModalOpen = false" 
    />
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.menu-wrapper {
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 {
    font-family: $font-principal;
    font-size: 2.8rem;
    color: $BAKANO-DARK;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-family: $font-principal;
    font-size: 1rem;
    font-weight: 600;
    color: $white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba($BAKANO-DARK, 0.1);
    }

    &:active {
      transform: translateY(-1px);
    }

    &.dish {
      background: $BAKANO-PINK;
    }

    &.drink {
      background: $BAKANO-PURPLE;
    }

    i {
      font-size: 0.9rem;
    }
  }
}

.menu-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

h2 {
  font-family: $font-principal;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid $BAKANO-LIGHT;
  padding-bottom: 1rem;
  color: $BAKANO-DARK;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.empty-state {
  background: $BAKANO-LIGHT;
  padding: 3rem 2rem;
  border-radius: 12px;
  text-align: center;
  border: 2px dashed darken($BAKANO-LIGHT, 15%);

  p {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($BAKANO-DARK, 0.7);
    font-weight: 500;
  }
}
</style>