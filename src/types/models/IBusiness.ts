import type { IDish } from './IDish'
import type { IDrink } from './IDrink'

export type ObjectId = string

export interface IBusinessHours {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  open: string
  close: string
  isOpen: boolean
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
