import { Request, Response } from "express";
import db from "../client/connect.js";
import * as userModel from "../model/user.model.js";

export const buyNow = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity, paymentMode = "COD" } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await userModel.userById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.address) return res.status(400).json({ message: "User address not found" });

    // Get product
    const product = await db.products.findUnique({
      where: { id: productId },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    //  total after discount
    const price = parseFloat(product.price);
    const discount = product.discount || 0;
    const totalAmount = quantity * (price - (price * discount / 100));

   
    const order = await db.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalAmount,
        address: user.address,
        paymentMode,
        status: "Pending",
      },
    });

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("BuyNow Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get buynow detail

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { orderId } = req.params;

  if (!userId || !orderId) {
    return res.status(400).json({ message: "Missing user ID or order ID" });
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
