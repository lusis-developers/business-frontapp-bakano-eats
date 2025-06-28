import type { ObjectId } from './IBusiness'

export interface IDrink {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: 'Gaseosa' | 'Jugo Natural' | 'Bebida Energética' | 'Licor'
  size?: string
  imageUrl?: string
  business: ObjectId
  createdAt?: string
  updatedAt?: string
}
