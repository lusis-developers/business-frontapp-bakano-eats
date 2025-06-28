<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';

// --- Componentes ---
import CreateBusinessPrompt from '@/components/dashboard/CreateBusinessPrompt.vue';
import SetupScheduleForm from '@/components/dashboard/SetupScheduleForm.vue';
import SetupMenuPrompt from '@/components/dashboard/SetupMenuPrompt.vue';
import CreateOrderModal from '@/components/orders/CreateOrderModal.vue';
import type { IDish } from '@/types/models/IDish';
import type { IDrink } from '@/types/models/IDrink';
import MenuItemModal from '@/components/dashboard/MenuItemModal.vue';
import BUsinessDashboard from '@/components/dashboard/BUsinessDashboard.vue';

// --- Stores ---
const businessStore = useBusinessStore();
const menuStore = useMenuStore();

const { business, isLoading, hasBusiness } = storeToRefs(businessStore);
const { isMenuEmpty } = storeToRefs(menuStore);

const hasSchedule = computed(() => {
  return business.value && business.value.schedule && business.value.schedule.length > 0;
});

// --- LA MEJORA PROFESIONAL: EL "STATE MACHINE" ---
/**
 * Esta propiedad computada es ahora el ÚNICO cerebro que decide qué se muestra.
 * El template se vuelve mucho más limpio.
 */
const dashboardState = computed(() => {
  if (isLoading.value) return 'LOADING';
  if (!hasBusiness.value) return 'CREATE_BUSINESS';
  if (!hasSchedule.value) return 'SETUP_SCHEDULE';
  if (isMenuEmpty.value) return 'SETUP_MENU';
  return 'SHOW_DASHBOARD'; // El estado final y exitoso
});


// --- Lógica de Modales ---
const isMenuModalOpen = ref(false);
const isOrderModalOpen = ref(false);
const itemTypeToAddOrEdit = ref<'dish' | 'drink' | null>(null);
const currentItemToEdit = ref<IDish | IDrink | null>(null);

function openMenuItemModal(type: 'dish' | 'drink', itemToEdit: any = null) {
  currentItemToEdit.value = itemToEdit;
  itemTypeToAddOrEdit.value = type;
  isMenuModalOpen.value = true;
}

// --- Data Fetching ---
onMounted(() => {
  businessStore.fetchBusinessData();
});
</script>

<template>
  <main class="dashboard-wrapper">
    <div v-if="dashboardState === 'LOADING'" class="loading-container">
      <p class="loading-text">Cargando tu espacio de trabajo...</p>
    </div>
    
    <CreateBusinessPrompt v-if="dashboardState === 'CREATE_BUSINESS'" />
    
    <SetupScheduleForm v-if="dashboardState === 'SETUP_SCHEDULE'" />

    <SetupMenuPrompt
      v-if="dashboardState === 'SETUP_MENU'"
      @add-dish="openMenuItemModal('dish')"
      @add-drink="openMenuItemModal('drink')"
    />

    <BUsinessDashboard
      v-if="dashboardState === 'SHOW_DASHBOARD' && business"
      :business="business"
      @add-order="isOrderModalOpen = true"
    />

    <MenuItemModal
      :is-open="isMenuModalOpen"
      :item-type="itemTypeToAddOrEdit"
      :item-to-edit="currentItemToEdit"
      @close="isMenuModalOpen = false" 
    />
    <CreateOrderModal 
      :is-open="isOrderModalOpen" 
      @close="isOrderModalOpen = false" 
    />
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.dashboard-wrapper {
  width: 100%;

  min-height: calc(100vh - 80px); // Asumiendo altura del header
}

.loading-container {
  display: flex;

  justify-content: center;

  align-items: center;

  height: 50vh;
}

.loading-text {
  font-family: $font-principal;

  font-size: 1.5rem;

  color: rgba($BAKANO-DARK, 0.7);
}

.business-title {
  padding: 3rem 3rem 0;

  font-family: $font-principal;

  font-size: 2.5rem;

  color: $BAKANO-DARK;
}

.business-subtitle {
  padding: 0 3rem;

  font-size: 1.2rem;

  color: rgba($BAKANO-DARK, 0.8);
}

.dashboard-wrapper {
  width: 100%;

  min-height: calc(100vh - 80px);
}

.loading-container {
  display: flex;

  justify-content: center;

  align-items: center;

  height: 50vh;
}

.loading-text {
  font-family: $font-principal;

  font-size: 1.5rem;

  color: rgba($BAKANO-DARK, 0.7);
}

.business-title {
  padding: 3rem 3rem 0;

  font-family: $font-principal;

  font-size: 2.5rem;

  color: $BAKANO-DARK;
}

.business-subtitle {
  padding: 0 3rem;

  font-size: 1.2rem;

  color: rgba($BAKANO-DARK, 0.8);
}

.panel-container {
  padding: 3rem 4rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.business-title {
  font-family: $font-principal;
  font-size: 2.8rem;
  color: $BAKANO-DARK;
  margin: 0;
}

.business-subtitle {
  font-size: 1.2rem;
  color: rgba($BAKANO-DARK, 0.8);
  margin-top: 0.5rem;
}

.add-order-button {
  background: $BAKANO-GREEN;
  color: $white;
  border: none;
  padding: 0.9rem 2rem;
  font-family: $font-principal;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($BAKANO-GREEN, 10%);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba($BAKANO-GREEN, 0.3);
  }
}

.dashboard-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.loading-text {
  font-family: $font-principal;
  font-size: 1.5rem;
  color: rgba($BAKANO-DARK, 0.7);
}
</style>
