import { Request, Response } from "express";
import db from "../client/connect.js";


// Add to Cart
// export const addToCart = async (req: Request, res: Response) => {
//    const userId = req.user?.id;
//    console.log("userID: ->> ",userId);
   
//   const { productId, quantity, referralCode } = req.body;

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   // const { userId, productId, quantity, referralCode } = req.body;

//   try {
//     // 1. Get the product
//     const product = await db.products.findUnique({ where: { id: productId } });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const originalPrice = parseFloat(product.price); // ensure it's a number
//     const productDiscountPercent = product.discount || 0;

//     // 2. Apply product discount
//     const discountedPrice = originalPrice - (originalPrice * productDiscountPercent) / 100;

//     let referralFinalPrice = discountedPrice; // final amount user pays
//     let referralPercent: number | null = null;

//     // 3. Apply referral discount if code provided
//     if (referralCode) {
//       const match = referralCode.trim().toLowerCase().match(/^([a-zA-Z]+)-(\d+)$/);

//       if (!match) {
//         return res.status(400).json({ message: "Invalid referral code format. Use like 'alisha-5'" });
//       }

//       referralPercent = parseFloat(match[2]);

//       if (isNaN(referralPercent) || referralPercent <= 0 || referralPercent > 100) {
//         return res.status(400).json({ message: "Referral percent must be between 1 and 100" });
//       }

//       // Apply referral discount on top of discounted price
//       referralFinalPrice = discountedPrice - (discountedPrice * referralPercent) / 100;
//     }

//     // 4. Save to cart
//     const cartItem = await db.cartItem.create({
//       data: {
//         userId,
//         productId,
//         quantity,
//         referralCode: referralCode || null,
//         referralPercent,
//         discountedPrice: referralFinalPrice, // this is what user pays
//       },
//       include: {
//         product: true,
//       },
//     });

//     // 5. Respond
//     return res.status(201).json({
//       message: "Product added to cart successfully",
//       cartItem: {
//         id: cartItem.id,
//         product: cartItem.product,
//         quantity: cartItem.quantity,
//         referralCode: cartItem.referralCode,
//         referralPercent: cartItem.referralPercent,
//         originalPrice,
//         productDiscountPercent,
//         discountedPrice,        // after product discount
//         finalPrice: referralFinalPrice, // after both discounts
//         createdAt: cartItem.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error adding to cart:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id || req.body.userId;
  const { productId, quantity = 1, referralCode } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: userId is missing" });
  }

  try {
    // 1. Get the product
    const product = await db.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const originalPrice = parseFloat(product.price);
    const productDiscountPercent = product.discount || 0;

    // 2. Apply product discount
    const discountedPrice =
      originalPrice - (originalPrice * productDiscountPercent) / 100;

    let referralFinalPrice = discountedPrice;
    let referralPercent: number | null = null;

    // 3. Apply referral discount (if valid)
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

      referralFinalPrice =
        discountedPrice - (discountedPrice * referralPercent) / 100;
    }

    // 4. Create cart item
    const cartItem = await db.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        referralCode: referralCode || null,
        referralPercent,
        discountedPrice: referralFinalPrice,
      },
      include: {
        product: true,
      },
    });

    // 5. Response
    return res.status(201).json({
      message: "Product added to cart successfully",
      cartItem: {
        id: cartItem.id,
        product: cartItem.product,
        quantity: cartItem.quantity,
        referralCode: cartItem.referralCode,
        referralPercent: cartItem.referralPercent,
        originalPrice,
        productDiscountPercent,
        discountedPrice,
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
      const originalPrice = parseFloat(item.product.price); // e.g., 3999
      const productDiscountPercent = item.product.discount || 0;

      const productDiscountAmount = (productDiscountPercent / 100) * originalPrice;
      const productDiscountPrice = parseFloat((originalPrice - productDiscountAmount).toFixed(2)); // 2199.45

      const referralPercent = item.referralPercent ?? 0;
      const referralApplied = referralPercent > 0;

      // Use already stored discountedPrice (includes referral if applied)
      const finalPrice = parseFloat((item.discountedPrice ?? productDiscountPrice).toFixed(2));

      return {
        id: item.id,
        productId: item.productId,
        userId: item.userId,
        quantity: item.quantity,
        referralCode: item.referralCode ?? null,
        referralPercent: referralPercent || null,
        referralApplied,
        originalPrice,
        productDiscountPercent,
        productDiscountPrice,
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
