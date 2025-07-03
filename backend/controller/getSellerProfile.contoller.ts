import { Request, Response } from "express";
import db from "../client/connect.js"; 

export const getSellerDashboardDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        // Seller's products
        productSeller: {
          select: {
          id: true,
          name: true,
          price: true,
          discount: true,
          images: true,
          category: true,
          // @ts-ignore
          createdAt: true,
          ratings: true,
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true
            }
          },
          orders: {
            select: {
              id: true,
              quantity: true,
              totalAmount: true,
              status: true,
              createdAt: true
            }
          }
        }
      },

        // Reviews given by the user (if any)
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            product: {
              select: {
                id: true,
                name: true
              }
            },
            createdAt: true
          }
        },

        // Marketplace and property enquiries
        marketplaces: {
          select: {
            id: true,
            name: true,
            enquires: true
          }
        },
        properties: {
          select: {
            id: true,
            name: true,
            enquires: true
          }
        },

        // Orders placed by user (optional if seller buys too)
        orders: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            },
            quantity: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching seller dashboard:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
