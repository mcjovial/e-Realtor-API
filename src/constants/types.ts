// User Model 
interface UserAttributes {
  _id?: string
  name: string
  email: string
  password: string
  phone: string
  isAdmin?: boolean
}

interface PropertyAttributes {
  _id?: string
  title: string
  description: string
  size: number
  rent: number
  state: string
  area: string
  street: string
  services: Array<string>
  images: Array<string>
  userId: string
}

export { UserAttributes, PropertyAttributes }