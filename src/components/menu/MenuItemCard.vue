<script setup lang="ts">
import type { IDish, IDrink } from '@/types/models/IBusiness';

defineProps<{
  item: IDish | IDrink;
}>();

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="item-card">
    <div class="card-content">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-price">${{ item.price.toFixed(2) }}</p>
      <p class="item-description">{{ item.description }}</p>
    </div>
    <div class="card-actions">
      <button class="action-btn edit-btn" @click="emit('edit', item._id)">Editar</button>
      <button class="action-btn delete-btn" @click="emit('delete', item._id)">Borrar</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.item-card {
  background: $white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba($BAKANO-DARK, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba($BAKANO-DARK, 0.08);
  }
}

.card-content {
  flex-grow: 1;
  padding: 1.5rem;
}

.item-name {
  font-family: $font-principal;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: $BAKANO-DARK;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: $BAKANO-GREEN;
  margin-bottom: 1rem;
}

.item-description {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.7);
  line-height: 1.5;
}

.card-actions {
  display: flex;
  border-top: 1px solid $BAKANO-LIGHT;

  .action-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;

    &:first-child {
      border-right: 1px solid $BAKANO-LIGHT;
    }

    &.edit-btn {
      color: $BAKANO-PURPLE;

      &:hover {
        background-color: lighten($BAKANO-PURPLE, 40%);
      }
    }

    &.delete-btn {
      color: $BAKANO-PINK;

      &:hover {
        background-color: lighten($BAKANO-PINK, 40%);
      }
    }
  }
}
</style>