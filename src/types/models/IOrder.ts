import type { ObjectId } from './IBusiness'
import type { IDish } from './IDish'
import type { IDrink } from './IDrink'

export interface IOrderItem {
  item: IDish | IDrink
  onModel: 'Dish' | 'Drink'
  quantity: number
  priceAtOrder: number
}

export interface IOrder {
  _id: ObjectId
  business: ObjectId
  customerName: string
  customerPhone: string
  customerAddress: string
  items: IOrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta'
  salesChannel: 'WhatsApp' | 'Instagram' | 'Presencial'
  deliveryType: 'Pickup' | 'Delivery'
  comments?: string
  createdAt: string
  updatedAt: string
}
