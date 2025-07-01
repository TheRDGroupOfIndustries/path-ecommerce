export type PropertyCategory = "Houses" | "Plots"

export interface CreatePropertyInput {
  name: string
  description: string
  imageUrl: string[]
  category?: PropertyCategory
  createdById: string
}

export interface UpdatePropertyInput {
  id: string
  name?: string
  description?: string
  imageUrl?: string[]
  category?: PropertyCategory
}