import { PropertyCategory } from "../client/types/property.types.js";
import * as property from "../model/property.model.js";
import { Request, Response } from "express";

export const allProperty = async (req: Request, res: Response) => {
    try {
        const properties = await property.allProperty();
        if (properties.length === 0) {
            return res.status(404).json({ message: "No properties found" });
        }
        return res.status(200).json({ properties });
    } catch (error) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const propertyByCat = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const properties = await property.propertyByCat(category as PropertyCategory);
        if (properties.length === 0) {
            return res.status(404).json({ message: "No properties found for this category" });
        }
        return res.status(200).json({ properties });
    } catch (error) {
        console.error("Error fetching properties by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const propertiesById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const properties = await property.propertyById(id);
        if (!properties) {
            return res.status(404).json({ message: "Marketplace not found" });
        }
        return res.status(200).json({ properties });
    } catch (error) {
        console.error("Error fetching properties by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProperty = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        await property.createProperty(body);
        return res.status(201).json({ message: "Property created successfully" });
    } catch (error) {
        console.error("Error creating marketplace:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    try {
        await property.updateProperty(id, body);
        return res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await property.deleteProperty(id);
        return res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const propertyByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const properties = await property.allProperty();
        const userProperties = properties.filter((properties: { createdById: string; }) => properties.createdById === userId);
        if (userProperties.length === 0) {
            return res.status(404).json({ message: "No properties found for this user" });
        }
        return res.status(200).json({ properties: userProperties });
    } catch (error) {
        console.error("Error fetching property by user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};