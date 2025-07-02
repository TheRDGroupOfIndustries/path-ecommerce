export interface CreateMarketplaceInput {
  name: string
  description: string
  imageUrl: string[]
  category?: string
  createdById: string
}

export interface UpdateMarketplaceInput {
  id: string
  name?: string
  description?: string
  imageUrl?: string[]
  category?: string
}