import db from "../client/connect.js";
import { CreateMarketplaceInput, UpdateMarketplaceInput } from "../client/types/marketplace.types.js";

export const allMarketplaces = async () => db.marketplace.findMany({});

// Get marketplaces created by a specific seller
export const marketplacesBySeller = async (sellerId: string) => {
  return await db.marketplace.findMany({
    where: {
      createdById: sellerId,
    },
  });
};

export const marketplaceByCat = async (category: string) =>
  db.marketplace.findMany({ where: { category } });

export const marketplaceById = async (id: string) =>
  db.marketplace.findUnique({ where: { id } });


export const searchMarketplacesByName = async (value: string) => {
  return db.marketplace.findMany({
    where: {
      name: {
        contains: value,
        mode: "insensitive", 
      },
    },
  });
};


export const getSearchResults = async (query: string) => {
    return await db.marketplace.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    }
                },
                {
                    category: {
                        contains: query,
                        mode: "insensitive",
                    }
                },
                {
                    description: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    createdBy: {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        },
        include: {
            createdBy: true
        }
    })
}


export const createMarketplace = async (data: CreateMarketplaceInput) => {
    await db.marketplace.create({
        data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category || null,
        createdById: data.createdById,
        createdAt: new Date(),
        },
    });
}

export const updateMarketPlace = async (id: string, data: UpdateMarketplaceInput) => {
    const market = await db.marketplace.findUnique({ where: { id } });
    await db.marketplace.update({
        where: { id: id },
        data: {
            name: data.name || market?.name,
            description: data.description || market?.description,
            imageUrl: data.imageUrl || market?.imageUrl,
            category: data.category || market?.category || null,
        },
    });
}

export const deleteMarketplace = async (id: string) => {
    await db.marketplace.delete({
        where: { id: id }
    });
}