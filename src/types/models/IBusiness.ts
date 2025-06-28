export type ObjectId = string

export interface IBusinessHours {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  open: string
  close: string
  isOpen: boolean
}

/**
 * Corresponde a la interfaz IDish de tu modelo de Mongoose.
 */
export interface IDish {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: 'Entrante' | 'Plato Fuerte' | 'Postre' | 'Sopa'
  imageUrl?: string
  business: ObjectId
  createdAt?: string
  updatedAt?: string
}

/**
 * Corresponde a la interfaz IDrink de tu modelo de Mongoose.
 */
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

export interface IBusiness {
  _id: ObjectId
  name: string
  description: string
  address: string
  phone: string
  owner: ObjectId
  schedule: IBusinessHours[]

  dishes: IDish[]
  drinks: IDrink[]

  createdAt: string
  updatedAt: string
}
