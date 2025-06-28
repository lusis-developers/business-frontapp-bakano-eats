<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useOrderStore from '@/stores/order.store';
import OrderListItem from '@/components/orders/OrderListItem..vue';

const businessStore = useBusinessStore();
const orderStore = useOrderStore();

const { business } = storeToRefs(businessStore);
const { orders, isLoading } = storeToRefs(orderStore);

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));
const confirmedOrders = computed(() => orders.value.filter(o => o.status === 'confirmed'));
const preparingOrders = computed(() => orders.value.filter(o => o.status === 'preparing'));
const deliveredOrders = computed(() => orders.value.filter(o => o.status === 'delivered'));

// Al montar la vista, le pedimos al store que busque las órdenes.
onMounted(() => {
  // Esta lógica robusta asegura que tengamos el businessId, incluso si el usuario recarga la página aquí.
  if (business.value) {
    orderStore.fetchOrders(business.value._id);
  } else {
    businessStore.fetchBusinessData().then(() => {
      if (business.value) {
        orderStore.fetchOrders(business.value._id);
      }
    });
  }
});
</script>

<template>
  <main class="orders-wrapper">
    <header class="orders-header">
      <h1>Flujo de Órdenes Activas</h1>
      <p>Gestiona los pedidos desde que llegan hasta que se entregan.</p>
    </header>

    <div v-if="isLoading" class="loading-container">Cargando órdenes...</div>
    
    <div v-else class="kanban-board">
      <div class="kanban-column">
        <h2 class="column-title pending">Nuevas ({{ pendingOrders.length }})</h2>
        <div class="column-content">
          <OrderListItem v-for="order in pendingOrders" :key="order._id" :order="order" />
          <p v-if="pendingOrders.length === 0" class="empty-column">No hay órdenes nuevas.</p>
        </div>
      </div>

      <div class="kanban-column">
        <h2 class="column-title confirmed">Confirmadas ({{ confirmedOrders.length }})</h2>
        <div class="column-content">
          <OrderListItem v-for="order in confirmedOrders" :key="order._id" :order="order" />
           <p v-if="confirmedOrders.length === 0" class="empty-column">Ninguna orden confirmada.</p>
        </div>
      </div>

      <div class="kanban-column">
        <h2 class="column-title preparing">En Cocina ({{ preparingOrders.length }})</h2>
        <div class="column-content">
          <OrderListItem v-for="order in preparingOrders" :key="order._id" :order="order" />
           <p v-if="preparingOrders.length === 0" class="empty-column">Nada en preparación.</p>
        </div>
      </div>

      <div class="kanban-column">
        <h2 class="column-title delivered">Entregadas ({{ deliveredOrders.length }})</h2>
        <div class="column-content">
          <OrderListItem v-for="order in deliveredOrders" :key="order._id" :order="order" />
          <p v-if="deliveredOrders.length === 0" class="empty-column">Aún no se ha entregado nada.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

/* --- Estilos Base (Mobile First) --- */
.orders-wrapper {
  // En móviles, usamos un padding más ajustado.
  padding: 1.5rem 1rem;
}

.orders-header {
  margin-bottom: 2rem;
  text-align: center; // Centramos el texto en móviles para un look más limpio

  h1 {
    font-family: $font-principal;
    font-size: 2.2rem; // Un poco más pequeño para móviles
    color: $BAKANO-DARK;
  }

  p {
    font-size: 1.1rem;
    color: rgba($BAKANO-DARK, 0.7);
    max-width: 400px;
    margin: 0.5rem auto 0;
  }
}

.kanban-board {
  // En mobile, usamos Flexbox en modo columna. Una columna encima de otra.
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kanban-column {
  background: lighten($BAKANO-LIGHT, 2%);
  border-radius: 12px;
  width: 100%; // Cada columna ocupa todo el ancho
  display: flex; // Hacemos la columna un contenedor flex...
  flex-direction: column; // ...para que el contenido crezca verticalmente.
}

.column-title {
  font-family: $font-principal;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 4px solid;
  flex-shrink: 0; // Evita que el título se encoja

  // Clases de color para los bordes
  &.pending {
    border-color: #facc15;
  }

  &.confirmed {
    border-color: $BAKANO-GREEN;
  }

  &.preparing {
    border-color: $BAKANO-PURPLE;
  }

  &.delivered {
    border-color: #9ca3af;
  }
}

.column-content {
  padding: 1rem;
  flex-grow: 1; // Permite que esta área crezca para igualar alturas en desktop
}

.empty-column {
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: rgba($BAKANO-DARK, 0.5);
}


/* --- Tablet y superior (768px) --- */
@media (min-width: 768px) {
  .orders-wrapper {
    padding: 2rem; // Aumentamos el padding
  }

  .orders-header {
    text-align: left; // Alineamos a la izquierda

    h1 {
      font-size: 2.5rem;
    }

    p {
      margin-left: 0;
    }
  }

  .kanban-board {
    // Aquí ocurre la magia: cambiamos la dirección y permitimos el wrap.
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch; // Hacemos que todas las columnas en una fila tengan la misma altura
  }

  .kanban-column {
    // La clave del Flexbox responsive:
    // flex-grow: 1 (permite crecer)
    // flex-shrink: 1 (permite encogerse)
    // flex-basis: 350px (su ancho base ideal)
    // El navegador hará el resto para acomodar las columnas.
    flex: 1 1 350px;
  }
}


/* --- Desktop y superior (1200px) --- */
@media (min-width: 1200px) {
  .orders-wrapper {
    padding: 2rem 4rem; // Padding final para pantallas grandes
    max-width: 1800px;
    margin: 0 auto;
  }
}
</style>