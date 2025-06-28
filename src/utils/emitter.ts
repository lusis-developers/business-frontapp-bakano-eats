import mitt from 'mitt'

// Definimos los eventos que nuestra aplicación puede emitir
type ApplicationEvents = {
  'menu-updated': void // No necesita pasar datos, solo es una notificación
  // Aquí podríamos añadir más eventos en el futuro, ej: 'order-created': IOrder
}

const emitter = mitt<ApplicationEvents>()

export default emitter
