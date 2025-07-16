import { Request, Response } from "express";
import db from "../client/connect.js";

// Add to Cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId, quantity, referralCode } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!productId) {
    res.status(400).json({ message: "Product ID required" });
    return;
  }

  try {
    const product = await db.products.findUnique({ where: { id: productId } });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let discountedPrice = parseFloat(product.price);

    //  Prevent multiple referrals in cart
    if (referralCode) {
      const existingReferralItem = await db.cartItem.findFirst({
        where: {
          userId,
          discountedPrice: {
            not: parseFloat(product.price), // referral already applied
          },
        },
        include: {
          product: true,
        },
      });

      if (existingReferralItem) {
          res.status(400).json({
          message: `Referral already applied to ${existingReferralItem.product.name}`,
        });
      }

      const referral = await db.referral.findUnique({
        where: { referral: referralCode },
      });

      if (referral && product.referralPercentage) {
        const percent = product.referralPercentage;
        discountedPrice = discountedPrice - (discountedPrice * percent) / 100;
        discountedPrice = parseFloat(discountedPrice.toFixed(2));
      }
    }

    const existingItem = await db.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
          discountedPrice,
        },
      });

      res.status(200).json(updatedItem);
      return;
    }

    const newItem = await db.cartItem.create({
      data: {
        userId,
        productId,
        quantity: quantity || 1,
        discountedPrice,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Get Cart Items
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

    const modifiedCartItems = cartItems.map(item => {
      const originalPrice = parseFloat(item.product.price);
      const referralApplied = item.discountedPrice < originalPrice;

      return {
        ...item,
        referralApplied,
        referralCode: referralApplied ? item.product.referralBy : null,
      };
    });

    res.status(200).json(modifiedCartItems);
  } catch (error) {
    console.error("Get cart error:", error);
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
