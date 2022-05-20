// User Model 
interface UserAttributes {
  _id?: string
  name: string
  email: string
  password: string
  phone: string
  isAdmin?: boolean
}

interface LoginCredentials {
  email: string
  password: string
}

export { UserAttributes, LoginCredentials }