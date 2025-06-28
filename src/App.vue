<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useAuthStore from '@/stores/auth.store';

import Header from './components/globals/header.vue'
import Footer from './components/globals/footer.vue'

const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <Header v-if="isAuthenticated" />
  <main :class="['main-content', { 'with-header': isAuthenticated }]">
    <RouterView />
  </main>
  <Footer />
</template>


<style lang="scss">
@use '@/styles/index.scss' as *;

.main-content {
  min-height: 100vh;
}

.main-content.with-header {
  margin-top: 56px;
}
</style>
