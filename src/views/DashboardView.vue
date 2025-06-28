<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';

import CreateBusinessPrompt from '@/components/dashboard/CreateBusinessPrompt.vue';
import SetupScheduleForm from '@/components/dashboard/SetupScheduleForm.vue';

const businessStore = useBusinessStore();
const { business, isLoading, hasBusiness } = storeToRefs(businessStore);

// Creamos un getter computado para la nueva condición
const hasSchedule = computed(() => {
  return business.value && business.value.schedule && business.value.schedule.length > 0;
});

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
      <div v-if="hasBusiness && business">
        
        <div v-if="hasSchedule">
          <h1 class="business-title">Panel de {{ business.name }}</h1>
          <p class="business-subtitle">¡Todo listo! Aquí verás tus estadísticas y órdenes.</p>
        </div>

        <SetupScheduleForm v-else />

      </div>

      <CreateBusinessPrompt v-else />
    </div>
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