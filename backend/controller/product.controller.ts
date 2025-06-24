import * as productModel from "../model/products.model.js"
import { Request, Response } from "express"
import { verifyToken } from "../utils/jwt.js"

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

export const getByCatogery = async (req: Request, res: Response) => {
    const { catogery } = req.params
    const products = await productModel.getByCatogery(catogery)
    res.status(200).json(products)
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    await productModel.deleteProduct(id)
    res.status(200).json({"message": "success"})
}

export const createData = async (req: Request, res: Response) => {
    const body = req.body
    const token: string | boolean = verifyToken(req)
    if (!token) {
        res.status(404).json({"message": "wrong auth"})
    }
    const products = await productModel.createProduct(body, token as string)
    if (products) {
        res.status(200).json({"message": "successfully created."})
    }
}

export const updateData = async (req: Request, res: Response) => {
    const body = req.body
    try {
        const products = await productModel.updateProduct(body, body.id)
        res.status(200).json({products, error: "Updated successfully!"})
    }
    catch (err) {
        res.status(404).json({"error": err})
    }
}