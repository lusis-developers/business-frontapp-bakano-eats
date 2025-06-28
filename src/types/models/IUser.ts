export type ObjectId = string

export interface IUser {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  role: 'client' | 'owner'
  business?: ObjectId
  createdAt?: string
  updatedAt?: string
}
