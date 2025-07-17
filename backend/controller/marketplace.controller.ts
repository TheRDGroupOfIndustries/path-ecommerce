import * as marketPlaceModel from "../model/marketplace.model.js";
import { Request, Response } from "express";

export const allMarketplaces = async (req: Request, res: Response) => {
    try {
        const marketplaces = await marketPlaceModel.allMarketplaces();
        if (marketplaces.length === 0) {
            return res.status(404).json({ message: "No marketplaces found" });
        }
        return res.status(200).json({ marketplaces });
    } catch (error) {
        console.error("Error fetching all marketplaces:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getSearchResults = async (req: Request, res: Response) => {
    const {value} = req.params
    const products = await marketPlaceModel.getSearchResults(value)
    res.status(201).json(products)
}

export const marketplaceByCat = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const marketplaces = await marketPlaceModel.marketplaceByCat(category);
        if (marketplaces.length === 0) {
            return res.status(404).json({ message: "No marketplaces found for this category" });
        }
        return res.status(200).json({ marketplaces });
    } catch (error) {
        console.error("Error fetching marketplaces by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const marketplaceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const marketplace = await marketPlaceModel.marketplaceById(id);
        if (!marketplace) {
            return res.status(404).json({ message: "Marketplace not found" });
        }
        return res.status(200).json({ marketplace });
    } catch (error) {
        console.error("Error fetching marketplace by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createMarketplace = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        await marketPlaceModel.createMarketplace(body);
        return res.status(201).json({ message: "Marketplace created successfully" });
    } catch (error) {
        console.error("Error creating marketplace:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateMarketplace = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    try {
        await marketPlaceModel.updateMarketPlace(id, body);
        return res.status(200).json({ message: "Marketplace updated successfully" });
    } catch (error) {
        console.error("Error updating marketplace:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMarketplace = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await marketPlaceModel.deleteMarketplace(id);
        return res.status(200).json({ message: "Marketplace deleted successfully" });
    } catch (error) {
        console.error("Error deleting marketplace:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const marketplaceByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const marketplaces = await marketPlaceModel.allMarketplaces();
        const userMarketplaces = marketplaces.filter((marketplace: { createdById: string; }) => marketplace.createdById === userId);
        if (userMarketplaces.length === 0) {
            return res.status(404).json({ message: "No marketplaces found for this user" });
        }
        return res.status(200).json({ marketplaces: userMarketplaces });
    } catch (error) {
        console.error("Error fetching marketplaces by user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Role-based marketplace fetch
export const marketDataByUserRole = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    if (!userId || !userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userRole === "ADMIN") {
      const data = await marketPlaceModel.allMarketplaces();
      return res.status(200).json({ data });
    }

    if (userRole === "SELLER") {
      const data = await marketPlaceModel.marketplacesBySeller(userId);
      return res.status(200).json({ data });
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("Error fetching marketplace data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};