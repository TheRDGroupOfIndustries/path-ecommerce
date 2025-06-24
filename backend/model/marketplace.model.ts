import db from "../client/connect.js";
import { CreateMarketplaceInput, UpdateMarketplaceInput } from "../client/types/marketplace.types.js";

export const allMarketplaces = async () => db.marketplace.findMany({});

export const marketplaceByCat = async (category: string) =>
  db.marketplace.findMany({ where: { category } });

export const marketplaceById = async (id: string) =>
  db.marketplace.findUnique({ where: { id } });

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