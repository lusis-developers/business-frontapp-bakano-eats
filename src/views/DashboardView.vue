<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';

import CreateBusinessPrompt from '@/components/dashboard/CreateBusinessPrompt.vue';
import SetupScheduleForm from '@/components/dashboard/SetupScheduleForm.vue';
import MenuItemModal from '@/components/dashboard/MenuItemModal.vue';
import SetupMenuPrompt from '@/components/dashboard/SetupMenuPrompt.vue';

const businessStore = useBusinessStore();
const menuStore = useMenuStore();

const { business, isLoading, hasBusiness } = storeToRefs(businessStore);
const { isMenuEmpty } = storeToRefs(menuStore);

const hasSchedule = computed(() => {
  return business.value && business.value.schedule && business.value.schedule.length > 0;
});

const isModalOpen = ref(false);
const itemTypeToAdd = ref<'dish' | 'drink' | null>(null);

function openAddItemModal(type: 'dish' | 'drink') {
  itemTypeToAdd.value = type;
  isModalOpen.value = true;
}

onMounted(() => {
  businessStore.fetchBusinessData();
});
</script>

<template>
  <main class="dashboard-wrapper">
    <div v-if="isLoading" class="loading-container">
      <p class="loading-text">Cargando tu espacio de trabajo...</p>
    </div>

    <div v-else>
      <CreateBusinessPrompt v-if="!hasBusiness" />

      <SetupScheduleForm v-else-if="!hasSchedule" />

      <SetupMenuPrompt
        v-else-if="isMenuEmpty" 
        @add-dish="openAddItemModal('dish')"
        @add-drink="openAddItemModal('drink')"
      />

      <div v-else-if="business">
        <h1 class="business-title">Panel de {{ business.name }}</h1>
        <p class="business-subtitle">¡Todo listo! Aquí verás tus estadísticas y órdenes.</p>
        </div>
    </div>

    <MenuItemModal
      :is-open="isModalOpen"
      :item-type="itemTypeToAdd"
      @close="isModalOpen = false" 
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
</style>