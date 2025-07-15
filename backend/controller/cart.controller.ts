import { Request, Response } from "express";
import db from "../client/connect.js";

//  Add to Cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400).json({ message: "Product ID required" });
    return;
  }

  try {
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });

      res.status(200).json(updatedItem); 
      return;
    }

    const cartItem = await db.cartItem.create({
      data: {
        userId,
        productId,
        quantity: quantity || 1,
      },
    });

    res.status(201).json(cartItem); 
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Cart Items
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

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};


// Update Cart Item Quantity
// export const updateCartItemQuantity = async (req: Request, res: Response): Promise<void> => {
//   const userId = req.user?.id;
//   const { cartItemId, quantity } = req.body;

//   if (!userId) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }

//   if (!cartItemId || quantity === undefined) {
//     res.status(400).json({ message: "Cart item ID and quantity are required" });
//     return;
//   }

//   try {
//     const existingItem = await db.cartItem.findFirst({
//       where: {
//         id: cartItemId,
//         userId,
//       },
//     });

//     if (!existingItem) {
//       res.status(404).json({ message: "Cart item not found" });
//       return;
//     }

//     const updatedItem = await db.cartItem.update({
//       where: { id: cartItemId },
//       data: { quantity },
//     });

//     res.status(200).json(updatedItem);
//   } catch (error) {
//     console.error("Update quantity error:", error);
//     res.status(500).json({ message: "Failed to update cart item quantity" });
//   }
// };


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
      where: {
        id: cartItemId,
        userId,
      },
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
