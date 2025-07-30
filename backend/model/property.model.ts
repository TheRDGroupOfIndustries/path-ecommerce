import db from "../client/connect.js";
import { CreatePropertyInput, PropertyCategory, UpdatePropertyInput } from "../client/types/property.types.js";

export const allProperty = async () => db.property.findMany({});

// Get marketplaces created by a specific seller
export const propertyBySeller = async (sellerId: string) => {
  return await db.property.findMany({
    where: {
      createdById: sellerId,
    },
  });
};

export const propertyByCat = async (category: PropertyCategory) =>
  db.property.findMany({ where: { category } });

export const propertyById = async (id: string) =>
  db.property.findUnique({ where: { id } });

export const searchPropertyByName = async (value: string) => {
  return db.property.findMany({
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

export const createProperty = async (data: CreatePropertyInput) => {
    await db.property.create({
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

export const updateProperty = async (id: string, data: UpdatePropertyInput) => {
    await db.property.update({
        where: { id: id },
        data: {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            category: data.category || null,
        },
    });
}

export const deleteProperty = async (id: string) => {
    await db.property.delete({
        where: { id: id }
    });
}