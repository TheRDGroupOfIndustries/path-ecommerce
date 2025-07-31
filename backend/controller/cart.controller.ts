import { Request, Response } from "express";
import db from "../client/connect.js";

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.userId;
  const { productId, quantity = 1, referralCode } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: userId is missing" });
  }

  try {
    const product = await db.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const originalPrice = parseFloat(product.price);
    const productDiscountPercent = product.discount || 0;

    let referralPercent: number = 0;

    if (referralCode) {
      const match = referralCode.trim().toLowerCase().match(/^([a-zA-Z]+)-(\d+)$/);

      if (!match) {
        return res.status(400).json({
          message: "Invalid referral code format. Use like 'alisha-5'",
        });
      }

      referralPercent = parseFloat(match[2]);

      if (isNaN(referralPercent) || referralPercent <= 0 || referralPercent > 100) {
        return res.status(400).json({
          message: "Referral percent must be between 1 and 100",
        });
      }
    }

    const totalDiscountPercent = productDiscountPercent + referralPercent;
    const referralFinalPrice = parseFloat(
      (originalPrice - (originalPrice * totalDiscountPercent) / 100).toFixed(2)
    );

    const cartItem = await db.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        referralCode: referralCode || null,
        referralPercent: referralPercent || null,
        discountedPrice: referralFinalPrice,
      },
      include: {
        product: true,
      },
    });

    return res.status(201).json({
      message: "Product added to cart successfully",
      cartItem: {
        id: cartItem.id,
        product: cartItem.product,
        quantity: cartItem.quantity,
        referralCode: cartItem.referralCode,
        referralPercent,
        originalPrice,
        productDiscountPercent,
        finalPrice: referralFinalPrice,
        createdAt: cartItem.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
            discount: true,
            description: true,
            ratings: true,
            features: true,
            referralBy: true,
            referralPercentage: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const modifiedCartItems = cartItems.map((item) => {
      const originalPrice = parseFloat(item.product.price);
      const productDiscountPercent = item.product.discount || 0;
      const referralPercent = item.referralPercent || 0;

      const totalDiscountPercent = productDiscountPercent + referralPercent;
      const finalPrice = parseFloat(
        (originalPrice - (originalPrice * totalDiscountPercent) / 100).toFixed(2)
      );

      return {
        id: item.id,
        productId: item.productId,
        userId: item.userId,
        quantity: item.quantity,
        referralCode: item.referralCode ?? null,
        referralPercent,
        referralApplied: referralPercent > 0,
        originalPrice,
        productDiscountPercent,
        totalDiscountPercent,
        finalPrice,
        product: item.product,
        createdAt: item.createdAt,
      };
    });

    res.status(200).json(modifiedCartItems);
  } catch (error) {
    console.error("❌ Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};

// Update Quantity
export const updateCartItemQuantity = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { cartItemId, quantity } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!cartItemId || quantity === undefined) {
    res.status(400).json({ message: "Cart item ID and quantity are required" });
    return;
  }

  try {
    const existingItem = await db.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: cartItemId } });
      res.status(200).json({ message: "Cart item deleted" });
      return;
    }

    const updatedItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Failed to update cart item quantity" });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { cartItemId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!cartItemId) {
    res.status(400).json({ message: "Cart item ID is required" });
    return;
  }

  try {
    const existingItem = await db.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      res.status(404).json({ message: "Cart item not found or does not belong to user" });
      return;
    }

    await db.cartItem.delete({ where: { id: cartItemId } });

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
};
