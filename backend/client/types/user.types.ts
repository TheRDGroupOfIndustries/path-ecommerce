export type Role = 'USER' | 'ADMIN' | 'SELLER' | 'ASSOCIATE';
export interface CreateUserInput {
  name: string
  email: string
  password?: string
  phone?: string
  address?: string
  imageUrl?: string
  role?: Role
  createdById?: string
}

export interface UpdateUserInput {
  // id: string
  name?: string
  email?: string
  password?: string
  phone?: string
  address?: string
  imageUrl?: string
  role?: Role
  createdById?: string
}
