
import { Request, Response } from "express";
import db from "../client/connect.js";

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

// import { Request, Response } from "express";
// import db from "../client/connect.js";

// //  Add to Cart
// export const addToCart = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   const { productId, quantity } = req.body;

//   if (!productId) return res.status(400).json({ message: "Product ID required" });

//   try {
//     const existingItem = await db.cartItem.findFirst({
//       where: {
//         userId,
//         productId,
//       },
//     });

//     if (existingItem) {
//       const updatedItem = await db.cartItem.update({
//         where: { id: existingItem.id },
//         data: { quantity: existingItem.quantity + (quantity || 1) },
//       });
//       return res.status(200).json(updatedItem);
//     }

//     const cartItem = await db.cartItem.create({
//       data: {
//         userId,
//         productId,
//         quantity: quantity || 1,
//       },
//     });
//     res.status(201).json(cartItem);
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// //  Get Cart
// export const getCartItems = async (req: Request, res: Response) => {
//   const userId = req.user?.id;

//   try {
//     const cartItems = await db.cartItem.findMany({
//       where: { userId },
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true,
//             images: true,
//             price: true,
//             discount: true,
//             description: true,
//             ratings:true,
//             features:true,
//           },
//         },
//       },
//     });
//     res.status(200).json(cartItems);
//   } catch (error) {
//     console.error("Get cart error:", error);
//     res.status(500).json({ message: "Failed to fetch cart items" });
//   }
// };
