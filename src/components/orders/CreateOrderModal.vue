<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import useBusinessStore from '@/stores/business.store';
import useMenuStore from '@/stores/menu.store';
import useOrderStore from '@/stores/order.store';
import type { OrderItemPayload } from '@/types/api.type';
import type { IDish } from '@/types/models/IDish';
import type { IDrink } from '@/types/models/IDrink';

// --- Props y Emits ---
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

// --- Stores ---
const businessStore = useBusinessStore();
const menuStore = useMenuStore();
const orderStore = useOrderStore();
const { business } = storeToRefs(businessStore);
const { dishes, drinks } = storeToRefs(menuStore);
const { isLoading, error } = storeToRefs(orderStore);

// --- Estado Local del Formulario ---
const customerName = ref('');
const customerPhone = ref('');
const customerAddress = ref('');
const comments = ref('');
const paymentMethod = ref<'Efectivo' | 'Transferencia' | 'Tarjeta'>('Efectivo');
const salesChannel = ref<'WhatsApp' | 'Instagram' | 'Presencial'>('Presencial');
const deliveryType = ref<'Pickup' | 'Delivery'>('Delivery');
const selectedItems = ref<(OrderItemPayload & { name: string; price: number })[]>([]);
const itemToAdd = ref<string | null>(null);
const quantityToAdd = ref(1);

// --- Lógica Computada Profesional ---
const menuGroups = computed(() => {
  const groups = [];
  if (dishes.value.length > 0) {
    groups.push({ label: 'Platillos', items: dishes.value });
  }
  if (drinks.value.length > 0) {
    groups.push({ label: 'Bebidas', items: drinks.value });
  }
  return groups;
});

const totalAmount = computed(() =>
  selectedItems.value.reduce((total, item: { price: number; quantity: number }) => total + item.price * item.quantity, 0)
);

// --- Métodos ---
function handleAddItem() {
  if (!itemToAdd.value || quantityToAdd.value < 1) return;

  let item: (IDish | IDrink) | undefined = dishes.value.find(d => d._id === itemToAdd.value);
  let itemType: 'Dish' | 'Drink' = 'Dish';

  if (!item) {
    item = drinks.value.find(d => d._id === itemToAdd.value);
    itemType = 'Drink';
  }

  if (item) {
    selectedItems.value.push({
      itemId: item._id,
      itemType: itemType,
      quantity: quantityToAdd.value,
      name: item.name,
      price: item.price
    });
    itemToAdd.value = null;
    quantityToAdd.value = 1;
  }
}

function removeItem(index: number) {
  selectedItems.value.splice(index, 1);
}

async function handleSubmit() {
  if (!business.value) return;
  const payload = {
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    customerAddress: customerAddress.value,
    items: selectedItems.value.map(({ itemId, itemType, quantity }: { itemId: string; itemType: 'Dish' | 'Drink'; quantity: number }) => ({ itemId, itemType, quantity })),
    paymentMethod: paymentMethod.value,
    salesChannel: salesChannel.value,
    deliveryType: deliveryType.value,
    comments: comments.value,
  };
  await orderStore.createOrder(business.value._id, payload);
  if (!error.value) {
    emit('close');
  }
}

function resetForm() {
  customerName.value = '';
  customerPhone.value = '';
  customerAddress.value = '';
  comments.value = '';
  paymentMethod.value = 'Efectivo';
  salesChannel.value = 'Presencial';
  deliveryType.value = 'Delivery';
  selectedItems.value = [];
  itemToAdd.value = null;
  quantityToAdd.value = 1;
  orderStore.error = null;
}

// Usamos el evento @after-leave de <Transition> para un reset garantizado
// en lugar de un watcher con setTimeout.
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade" @after-leave="resetForm">
      <div v-if="props.isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-card">
          <h3 class="modal-title">Registrar Nueva Venta/Orden</h3>
          <form @submit.prevent="handleSubmit" class="order-form">
            
            <fieldset>
              <legend>1. Datos del Cliente</legend>
              <div class="form-group">
                <label for="customerName">Nombre del Cliente</label>
                <input v-model="customerName" id="customerName" type="text" placeholder="John Doe" required />
              </div>
              <div class="form-group-inline">
                <div class="form-group">
                  <label for="customerPhone">Teléfono</label>
                  <input v-model="customerPhone" id="customerPhone" type="tel" placeholder="0991234567" required />
                </div>
                <div class="form-group">
                  <label for="customerAddress">Dirección</label>
                  <input v-model="customerAddress" id="customerAddress" type="text" placeholder="Av. Siempre Viva 123" required />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>2. Artículos de la Orden</legend>
              <div class="add-item-form">
                <select v-model="itemToAdd" class="item-select">
                  <option :value="null" disabled>Selecciona un producto del menú...</option>
                  <optgroup v-for="group in menuGroups" :key="group.label" :label="group.label">
                    <option v-for="item in group.items" :key="item._id" :value="item._id">
                      {{ item.name }} - ${{ item.price.toFixed(2) }}
                    </option>
                  </optgroup>
                </select>
                <input v-model.number="quantityToAdd" type="number" min="1" class="quantity-input" />
                <button type="button" @click="handleAddItem" class="add-item-btn" title="Añadir item a la orden">+</button>
              </div>
              
              <ul v-if="selectedItems.length > 0" class="selected-items-list">
                <li v-for="(item, index) in selectedItems" :key="index">
                  <span class="item-info">{{ item.quantity }}x {{ item.name }}</span>
                  <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  <button type="button" @click="removeItem(index)" class="remove-item-btn" title="Quitar item">×</button>
                </li>
              </ul>
              <div v-if="totalAmount > 0" class="total-amount">Total: <span>${{ totalAmount.toFixed(2) }}</span></div>
            </fieldset>
            
            <fieldset>
                <legend>3. Detalles Finales</legend>
                <div class="form-group-inline three-cols">
                    <div class="form-group"><label>Método de Pago</label><select v-model="paymentMethod"><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></div>
                    <div class="form-group"><label>Canal de Venta</label><select v-model="salesChannel"><option>Presencial</option><option>WhatsApp</option><option>Instagram</option></select></div>
                    <div class="form-group"><label>Tipo de Entrega</label><select v-model="deliveryType"><option>Delivery</option><option>Pickup</option></select></div>
                </div>
                <div class="form-group">
                    <label>Comentarios (Opcional)</label>
                    <textarea v-model="comments" rows="2" placeholder="Ej: Sin cebolla, por favor."></textarea>
                </div>
            </fieldset>

            <div v-if="error" class="error-message">{{ error }}</div>
            <div class="modal-actions">
              <button type="button" class="button-secondary" @click="emit('close')" :disabled="isLoading">Cancelar</button>
              <button type="submit" class="button-primary" :disabled="isLoading || selectedItems.length === 0">
                {{ isLoading ? 'Creando...' : 'Crear Orden' }}
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

// Estilos para la transición del modal
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
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 95%;
  max-width: 800px;
}

.modal-title {
  font-family: $font-principal;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: $BAKANO-DARK;
}

.order-form {
  max-height: 75vh;
  overflow-y: auto;
  padding: 0 1rem;
}

// Estilos de los fieldsets y formularios
fieldset {
  border: none;
  border-top: 1px solid $BAKANO-LIGHT;
  padding-top: 2rem;
  margin-top: 1.5rem;

  &:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  legend {
    font-family: $font-principal;
    font-size: 1.2rem;
    font-weight: 600;
    padding-right: 1rem;
    color: $BAKANO-PURPLE;
  }
}

.form-group-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  &.three-cols {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: $BAKANO-DARK;
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

// Estilos para la sección de añadir items
.add-item-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;

  .item-select {
    flex-grow: 1;
  }

  .quantity-input {
    width: 80px;
    text-align: center;
  }

  .add-item-btn {
    flex-shrink: 0;
    background: $BAKANO-GREEN;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
    cursor: pointer;

    &:hover {
      background: darken($BAKANO-GREEN, 10%);
    }
  }
}

.selected-items-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;

  li {
    display: flex;
    align-items: center;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid $BAKANO-LIGHT;

    .item-info {
      flex-grow: 1;
      font-weight: 500;
    }

    .item-price {
      font-weight: 600;
      margin: 0 1rem;
      color: $BAKANO-DARK;
    }

    .remove-item-btn {
      background: none;
      border: none;
      color: $BAKANO-PINK;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;

      &:hover {
        color: darken($BAKANO-PINK, 10%);
      }
    }
  }
}

.total-amount {
  text-align: right;
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 1rem;
  color: $BAKANO-DARK;

  span {
    color: $BAKANO-GREEN;
    margin-left: 0.5rem;
  }
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
  border-top: 1px solid $BAKANO-LIGHT;
  padding-top: 1.5rem;

  button {
    padding: 0.8rem 1.8rem;
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