import type { ObjectId } from './IBusiness'

export interface IDish {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: 'Entrante' | 'Plato Fuerte' | 'Postre' | 'Sopa'
  imageUrl?: string
  business: ObjectId // Referencia al negocio al que pertenece
  createdAt?: string
  updatedAt?: string
}
