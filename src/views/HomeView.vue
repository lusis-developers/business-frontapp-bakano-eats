<script setup lang="ts">
// Por ahora, este componente es puramente presentacional.
// No necesita lógica compleja en el script.
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Gestiona tu Negocio, <span class="highlight">Simplifica tus Pedidos</span>.
        </h1>
        <p class="hero-description">
          La herramienta definitiva para que dueños de restaurantes y negocios de comida
          administren órdenes, actualicen su menú digital y controlen su operación desde un solo lugar.
        </p>
        <div class="hero-cta-container">
          <router-link to="/register" class="cta-button cta-button--primary">
            Registra tu Negocio Ahora
          </router-link>
          <router-link to="/login" class="cta-button cta-button--secondary">
            Ya tengo una cuenta
          </router-link>
        </div>
      </div>
      <!-- <div class="hero-image-container">
        <img 
          src="@/assets/images/dashboard-mockup.png" 
          alt="Dashboard de gestión de órdenes" 
          class="hero-image"
        />
      </div> -->
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(45deg, lighten($BAKANO-LIGHT, 5%), $white);
  padding: 6rem 2rem 2rem;
}

.hero {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: $BAKANO-DARK;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-family: $font-principal;

  .highlight {
    color: $BAKANO-PINK;
  }
}

.hero-description {
  font-size: 1.2rem;
  color: rgba($BAKANO-DARK, 0.7);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.hero-cta-container {
  display: flex;
  gap: 1rem;
}

.cta-button {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &--primary {
    background-color: $BAKANO-PINK;
    color: $white;
    box-shadow: 0 4px 20px rgba($BAKANO-PINK, 0.25);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba($BAKANO-PINK, 0.35);
    }
  }

  &--secondary {
    background-color: transparent;
    color: $BAKANO-PINK;
    border-color: $BAKANO-PINK;

    &:hover {
      background-color: rgba($BAKANO-PINK, 0.1);
    }
  }
}

.hero-image-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .hero-image {
    max-width: 100%;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 992px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    order: 2;
    text-align: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta-container {
    justify-content: center;
  }

  .hero-image-container {
    order: 1;
    margin-bottom: 3rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-cta-container {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    text-align: center;
    max-width: 300px;
  }
}
</style>