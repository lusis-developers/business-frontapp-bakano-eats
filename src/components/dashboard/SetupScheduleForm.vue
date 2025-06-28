<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import type { IBusinessHours } from '@/types/models/IBusiness';

const businessStore = useBusinessStore();
const { isLoading, error } = storeToRefs(businessStore);

// Creamos un estado local para el formulario, pre-poblado con los 7 días.
const daysOfWeek: IBusinessHours['day'][] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const localSchedule = ref<IBusinessHours[]>(
  daysOfWeek.map(day => ({
    day,
    open: '09:00',
    close: '17:00',
    isOpen: true,
  }))
);

async function handleSubmit() {
  // Filtramos solo los días que el usuario ha marcado como abiertos.
  const scheduleToSave = localSchedule.value.filter((day: any) => day.isOpen);
  await businessStore.updateSchedule(scheduleToSave);
}
</script>

<template>
  <div class="schedule-prompt">
    <div class="header">
      <h2>Define tu Horario de Atención</h2>
      <p>Establece cuándo tus clientes pueden hacer pedidos. Puedes ajustar esto más tarde.</p>
    </div>
    <form @submit.prevent="handleSubmit" class="schedule-form">
      <div v-for="day in localSchedule" :key="day.day" class="day-row">
        <input type="checkbox" :id="day.day" v-model="day.isOpen" class="day-checkbox"/>
        <label :for="day.day" class="day-label">{{ day.day }}</label>
        <div class="time-inputs" :class="{ disabled: !day.isOpen }">
          <input type="time" v-model="day.open" :disabled="!day.isOpen" />
          <span>-</span>
          <input type="time" v-model="day.close" :disabled="!day.isOpen" />
        </div>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <button type="submit" class="submit-button" :disabled="isLoading">
        {{ isLoading ? 'Guardando...' : 'Guardar Horario' }}
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// Estilos para el formulario de horario
.schedule-prompt {
  max-width: 700px;
  margin: 4rem auto;
  background: $white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba($BAKANO-DARK, 0.07);
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;

  h2 {
    font-family: $font-principal;
    font-size: 2rem;
    color: $BAKANO-DARK;
    margin-bottom: 0.5rem;
  }

  p {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($BAKANO-DARK, 0.7);
  }
}

.day-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: lighten($BAKANO-LIGHT, 2%);
  }
}

.day-label {
  font-weight: 600;
  width: 120px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;

  &.disabled {
    opacity: 0.5;
  }

  input[type="time"] {
    border: 1px solid darken($BAKANO-LIGHT, 10%);
    border-radius: 6px;
    padding: 0.5rem;
  }
}

.submit-button {
  // Reutilizar estilos del botón primario
  background: $BAKANO-GREEN;
  color: $white;
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: $font-principal;
  cursor: pointer;

  &:hover {
    background: darken($BAKANO-GREEN, 10%);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.error-message {
  // Reutilizar estilos de error
  margin-top: 1rem;
  background-color: rgba($BAKANO-PINK, 0.1);
  color: darken($BAKANO-PINK, 15%);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
</style>