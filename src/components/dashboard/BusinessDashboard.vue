<script setup lang="ts">
import type { IBusiness } from '@/types/models/IBusiness';

/**
 * Este componente es de "presentación". Recibe los datos que necesita
 * a través de props y emite eventos cuando el usuario quiere hacer algo.
 * Es una práctica muy limpia.
 */
defineProps<{
  business: IBusiness;
}>();

const emit = defineEmits(['add-order']);
</script>

<template>
  <div class="panel-container">
    <header class="panel-header">
      <div>
        <h1 class="business-title">Panel de {{ business.name }}</h1>
        <p class="business-subtitle">¡Todo listo para vender! Aquí tienes un resumen de tu actividad.</p>
      </div>
      <button class="add-order-button" @click="emit('add-order')">
        <i class="fas fa-plus"></i> Agregar Venta
      </button>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <h4>Órdenes de Hoy</h4>
        <p class="stat-value">12</p>
      </div>
      <div class="stat-card">
        <h4>Ingresos del Día</h4>
        <p class="stat-value">$150.75</p>
      </div>
      <div class="stat-card">
        <h4>Ticket Promedio</h4>
        <p class="stat-value">$12.56</p>
      </div>
       <div class="stat-card">
        <h4>Clientes Nuevos</h4>
        <p class="stat-value">3</p>
      </div>
    </section>

    <section class="actions-section">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <router-link to="/orders" class="action-card">
          <i class="fas fa-receipt"></i>
          <span>Ver Órdenes Activas</span>
          <p>Gestiona los pedidos pendientes y en preparación.</p>
        </router-link>
        <router-link to="/menu" class="action-card">
          <i class="fas fa-book-open"></i>
          <span>Editar Mi Menú</span>
          <p>Actualiza tus platillos, bebidas y precios.</p>
        </router-link>
         <router-link to="/reports" class="action-card disabled">
          <i class="fas fa-chart-line"></i>
          <span>Ver Reportes</span>
          <p>Analiza tus ventas y rendimiento (Próximamente).</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.panel-container {
  padding: 0 4rem 3rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 3rem 0;
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

// Estilos para las tarjetas de estadísticas
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.stat-card {
  background: $white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid $BAKANO-LIGHT;
  box-shadow: 0 4px 15px rgba($BAKANO-DARK, 0.03);

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: rgba($BAKANO-DARK, 0.7);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: $font-principal;
    font-size: 2.5rem;
    font-weight: 700;
    color: $BAKANO-PINK;
  }
}

// Estilos para las acciones rápidas
.actions-section {
  h2 {
    font-family: $font-principal;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: lighten($BAKANO-PURPLE, 42%);
  color: $BAKANO-PURPLE;
  padding: 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-family: $font-principal;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: block;
  }

  p {
    font-family: $font-secondary;
    font-size: 1rem;
    font-weight: 400;
    color: rgba($BAKANO-DARK, 0.7);
    line-height: 1.5;
    margin-top: 0.5rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba($BAKANO-PURPLE, 0.15);
    border-color: $BAKANO-PURPLE;
  }

  &.disabled {
    background-color: $BAKANO-LIGHT;
    border-color: transparent;
    color: #999;
    pointer-events: none;

    i {
      color: #ccc;
    }
  }
}
</style>