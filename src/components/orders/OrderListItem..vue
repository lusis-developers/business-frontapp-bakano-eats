<script setup lang="ts">
import { computed } from 'vue';
import useOrderStore from '@/stores/order.store';
import useBusinessStore from '@/stores/business.store';
import type { IOrder } from '@/types/models/IOrder';

const props = defineProps<{
  order: IOrder;
}>();

const orderStore = useOrderStore();
const businessStore = useBusinessStore();

// Formateamos la fecha para que sea más legible
const formattedDate = computed(() =>
  new Date(props.order.createdAt).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
);

// Función para llamar a la acción del store y cambiar el estado
function changeStatus(status: IOrder['status']) {
  if (!businessStore.business) {
    console.error("Error: ID del negocio no encontrado para actualizar la orden.");
    return;
  }
  // Llamamos a la acción que ya preparamos en nuestro store
  orderStore.updateOrderStatus(businessStore.business._id, props.order._id, { status });
}
</script>

<template>
  <div class="order-item" :class="order.status">
    <div class="main-info">
      <div class="customer-details">
        <span class="customer-name">{{ order.customerName }}</span>
        <span class="order-time">
          <i class="fas fa-clock"></i> {{ formattedDate }}
        </span>
      </div>
      <div class="order-summary">
        <span class="item-count">{{ order.items.length }} items</span>
        <span class="total-amount">${{ order.totalAmount.toFixed(2) }}</span>
      </div>
    </div>
    <div class="status-info">
      <div class="status-badge-wrapper">
        <span :class="['status-badge', order.status]">{{ order.status }}</span>
      </div>
      <div class="order-actions">
        <button v-if="order.status === 'pending'" @click="changeStatus('confirmed')" class="action-btn confirm">Confirmar</button>
        <button v-if="order.status === 'confirmed'" @click="changeStatus('preparing')" class="action-btn prepare">Empezar a Preparar</button>
        <button v-if="order.status === 'preparing'" @click="changeStatus('delivered')" class="action-btn deliver">Entregado</button>
        <button v-if="order.status !== 'delivered' && order.status !== 'cancelled'" @click="changeStatus('cancelled')" class="action-btn cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.order-item {
  background: $white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba($BAKANO-DARK, 0.05);
  margin-bottom: 1.5rem;
  border-left: 5px solid;
  transition: all 0.3s ease;

  // Colores del borde según el estado
  &.pending {
    border-color: #facc15;
  }

  // Amarillo
  &.confirmed {
    border-color: $BAKANO-GREEN;
  }

  &.preparing {
    border-color: $BAKANO-PURPLE;
  }

  &.delivered {
    border-color: #9ca3af;
  }

  // Gris
  &.cancelled {
    border-color: $BAKANO-PINK;
  }

  &:hover {
    box-shadow: 0 8px 30px rgba($BAKANO-DARK, 0.08);
    transform: translateY(-3px);
  }
}

.main-info,
.status-info {
  padding: 1rem 1.5rem;
}

.main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $BAKANO-LIGHT;
}

.customer-name {
  font-weight: 700;
  font-size: 1.2rem;
  color: $BAKANO-DARK;
}

.order-time {
  font-size: 0.9rem;
  color: rgba($BAKANO-DARK, 0.6);
}

.item-count {
  font-size: 0.9rem;
}

.total-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: $BAKANO-GREEN;
  margin-left: 1rem;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;

  &.pending {
    background-color: #fef08a;
    color: #854d0e;
  }

  &.confirmed {
    background-color: rgba($BAKANO-GREEN, 0.2);
    color: darken($BAKANO-GREEN, 10%);
  }

  &.preparing {
    background-color: rgba($BAKANO-PURPLE, 0.2);
    color: $BAKANO-PURPLE;
  }

  &.delivered {
    background-color: #e5e7eb;
    color: #374151;
  }

  &.cancelled {
    background-color: rgba($BAKANO-PINK, 0.2);
    color: $BAKANO-PINK;
  }
}

.order-actions {
  display: flex;
  gap: 0.75rem;

  .action-btn {
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &.confirm {
      background-color: $BAKANO-GREEN;
      color: $white;
    }

    &.prepare {
      background-color: $BAKANO-PURPLE;
      color: $white;
    }

    &.deliver {
      background-color: $BAKANO-DARK;
      color: $white;
    }

    &.cancel {
      background-color: $BAKANO-LIGHT;
      color: $BAKANO-DARK;
    }

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>