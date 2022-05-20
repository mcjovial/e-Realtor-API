// User Model 
interface UserAttributes {
  name: string
  email: string
  password: string
  phone: string
  isAdmin?: boolean
}

export { UserAttributes }