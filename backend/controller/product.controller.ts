import * as productModel from "../model/products.model.js"
import { Request, Response } from "express"

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await productModel.getAllProducts()
        res.status(200).json(products)
    }
    catch (err) {
        return res.status(500).json({error: err, "message": "failed to get products"})
    }
}

export const getById = async (req: Request, res: Response) => {
    const {id} = req.params
    const products = await productModel.getSlug(id)
    res.status(201).json(products)
}

export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await productModel.getByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    await productModel.deleteProduct(id)
    res.status(200).json({"message": "success"})
}

export const createData = async (req: Request, res: Response) => {
  const body = req.body;

  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  try {
    const product = await productModel.createProduct(body, user.id);
    return res.status(200).json({ message: "Product successfully created", product });
  } catch (error) {
    console.error("Product creation failed:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


export const updateData = async (req: Request, res: Response) => {
    const { id } = req.params;  
    const body = req.body;

    try {
        const product = await productModel.updateProduct(body, id);  
        res.status(200).json({ product, message: "Updated successfully!" });
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).json({ error: "Update failed", details: err });
    }
};

export const getTrendyProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getTrendyProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching trendy products:", error);
    res.status(500).json({ error: "Failed to fetch trendy products" });
  }
};



