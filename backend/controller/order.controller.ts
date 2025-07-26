import { Request, Response } from "express";
import db from "../client/connect.js";
import * as userModel from "../model/user.model.js";

// Buy now from single product
export const buyNow = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity, paymentMode = "COD", referralCode, price } = req.body;


  if (!userId || !productId || !quantity || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await userModel.userById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.address) return res.status(400).json({ message: "User address not found" });

    const product = await db.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        discount: true,
        referralPercentage: true,
        sellerId: true,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const originalPrice = parseFloat(product.price);
    const productDiscount = product.discount || 0;
    const priceAfterProductDiscount = originalPrice - (originalPrice * productDiscount / 100);

    let referralDiscountPercent = 0;
    let referralDiscountAmount = 0;
    let priceAfterReferralDiscount = priceAfterProductDiscount;
    let referralDetails = null;

    if (referralCode) {
      const referral = await db.referral.findUnique({
        where: { referral: referralCode },
        include: { createdFor: true },
      });

      if (!referral) return res.status(400).json({ message: "Invalid referral code" });

      referralDetails = referral;
      const referredByUser = referral.createdFor;
      const percentStr = referralCode.split("-")[1];
      const extractedPercent = percentStr ? parseFloat(percentStr) : NaN;

      if (!isNaN(extractedPercent) && extractedPercent > 0 && extractedPercent <= 100) {
        referralDiscountPercent = extractedPercent;
        referralDiscountAmount = (priceAfterProductDiscount * referralDiscountPercent) / 100;
        priceAfterReferralDiscount = priceAfterProductDiscount - referralDiscountAmount;

        await db.referralTransaction.create({
          data: {
            referralId: referral.id,
            associateId: referredByUser.id,
            sellerId: product.sellerId,
            userId,
            productId,
            productName: product.name,
            price: priceAfterReferralDiscount,
            percent: referralDiscountPercent,
            commission: referralDiscountAmount,
          },
        });

        if (referralCode && referralDetails && !referralDetails.usedBy.includes(userId)) {
        await db.referral.update({
          where: { id: referralDetails.id },
          data: {
            usedBy: {
              push: userId,
            },
          },
        });
      }
      } else {
        return res.status(400).json({ message: "Invalid referral code format" });
      }
    }

    const totalAmount = price;

    const order = await db.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalAmount,
        address: user.address,
        paymentMode,
        status: "Pending",
        referralCode: referralCode || null,
      },
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
      priceDetails: {
        originalPrice,
        productDiscount,
        priceAfterProductDiscount,
        referralDiscountPercent,
        referralDiscountAmount,
        priceAfterReferralDiscount,
        totalAmount,
      },
      referralUsed: referralDetails
        ? {
            referralCode: referralDetails.referral,
            createdBy: referralDetails.createdForId,
            usedBy: userId,
          }
        : null,
    });
  } catch (error) {
    console.error("BuyNow Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get order by ID

// export const getOrderById = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   const { orderId } = req.params;

//   if (!userId || !orderId) {
//     return res.status(400).json({ message: "Missing user ID or order ID" });
//   }

//   try {
//     const order = await db.order.findUnique({
//       where: { id: orderId },
//       include: {
//         product: true,
//         user: true,
//       },
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.userId !== userId) {
//       return res.status(403).json({ message: "Unauthorized access to this order" });
//     }

//     const product = order.product;

//     //  Null check for product 
//     if (!product) {
//       return res.status(404).json({ message: "Product associated with this order not found" });
//     }

//     const originalPrice = parseFloat(product.price);
//     const productDiscount = product.discount || 0;
//     const priceAfterProductDiscount = originalPrice - (originalPrice * productDiscount / 100);

//     let referralDiscountPercent = 0;
//     let referralDiscountAmount = 0;
//     let priceAfterReferralDiscount = priceAfterProductDiscount;
//     let referralUsed = null;

//     if (order.referralCode) {
//       const referralTransaction = await db.referralTransaction.findFirst({
//         where: {
//           referral: {
//             referral: order.referralCode,
//           },
//           userId,
//           productId: product.id,
//         },
//         include: {
//           referral: true,
//         },
//       });

//       if (referralTransaction && referralTransaction.referral) {
//         referralDiscountPercent = referralTransaction.percent;
//         referralDiscountAmount = (priceAfterProductDiscount * referralDiscountPercent) / 100;
//         priceAfterReferralDiscount = priceAfterProductDiscount - referralDiscountAmount;

//         referralUsed = {
//           referralCode: referralTransaction.referral.referral,
//           usedBy: referralTransaction.userId,
//           createdBy: referralTransaction.associateId,
//         };
//       }
//     }

//     const totalAmount = order.quantity * priceAfterReferralDiscount;

//     return res.status(200).json({
//       order,
//       priceDetails: {
//         originalPrice,
//         productDiscount,
//         priceAfterProductDiscount,
//         referralDiscountPercent,
//         referralDiscountAmount,
//         priceAfterReferralDiscount,
//         totalAmount,
//       },
//       referralUsed,
//     });
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// // Buy Now from Cart

// export const buyNowFromCart = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   const { paymentMode = "COD" } = req.body;

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const user = await db.user.findUnique({ where: { id: userId } });
//     // console.log(user);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     if (!user.address) return res.status(400).json({ message: "User address not found" });

//     const cartItems = await db.cartItem.findMany({
//       where: { userId },
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             discount: true,
//             referralPercentage: true,
//             referralBy: true,
//             sellerId: true,
//           },
//         },
//       },
//     });

//     if (cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const orderResults = [];
//     let totalItems = 0;
//     let grandTotal = 0;
//     const referralUsage: any[] = [];

//     for (const item of cartItems) {
//       const product = item.product;
//       const quantity = item.quantity || 1;
//       const originalPrice = parseFloat(product.price);
//       const productDiscount = product.discount || 0;
//       const priceAfterDiscount = originalPrice - (originalPrice * productDiscount) / 100;
//       const totalAmount = quantity * priceAfterDiscount;

//       let finalPrice = priceAfterDiscount;
// let referralCode = product.referralBy || null;

// if (referralCode) {
//   const referral = await db.referral.findUnique({
//     where: { referral: referralCode },
//     include: { createdFor: true },
//   });

//   if (referral) {
//     const referralPercent = product.referralPercentage ?? 0;
//     const referralDiscountAmount = (priceAfterDiscount * referralPercent) / 100;
//     finalPrice = priceAfterDiscount - referralDiscountAmount;

//     referralUsage.push({
//       referralCode: referral.referral,
//       createdBy: referral.createdForId,
//       usedBy: userId,
//       productId: product.id,
//       productName: product.name,
//       price: finalPrice,
//       commissionPercent: referralPercent,
//     });

//     await db.referralTransaction.create({
//       data: {
//         referralId: referral.id,
//         associateId: referral.createdFor.id,
//         userId,
//         productId: product.id,
//         productName: product.name,
//         price: finalPrice,
//         percent: referralPercent,
//         commission: (referralPercent / 100) * priceAfterDiscount, 
//         sellerId: product.sellerId,
//       },
//     });

//     if (!referral.usedBy.includes(userId)) {
//       await db.referral.update({
//         where: { id: referral.id },
//         data: {
//           usedBy: {
//             push: userId,
//           },
//         },
//       });
//     }
//   }
// }

//      const totalAmount = quantity * finalPrice;

//       const order = await db.order.create({
//         data: {
//           userId,
//           productId: product.id,
//           quantity,
//           totalAmount,
//           address: user.address,
//           paymentMode,
//           status: "Pending",
//           referralCode,
//           sellerId: product.sellerId, 
//         },
//       });


//       orderResults.push({
//         order,
//         priceDetails: {
//           originalPrice,
//           productDiscount: productDiscount,
//           priceAfterProductDiscount: priceAfterDiscount,
//           referralDiscountPercent: referralCode ? product.referralPercentage ?? 0 : 0,
//           priceAfterReferralDiscount: finalPrice,
//           totalAmount: totalAmount,
//         },
//       });

//       totalItems += quantity;
//       grandTotal += totalAmount;
//     }

//     await db.cartItem.deleteMany({ where: { userId } });

//     return res.status(201).json({
//       message: "All cart items ordered successfully",
//       totalItems,
//       grandTotal: parseFloat(grandTotal.toFixed(2)),
//       orders: orderResults,
//       referralUsed: referralUsage.length > 0 ? referralUsage : null,
//     });
//   } catch (error) {
//     console.error("BuyNowFromCart Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


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

    const product = order.product;

    if (!product) {
      return res.status(404).json({ message: "Product associated with this order not found" });
    }

    const originalPrice = parseFloat(product.price);
    const productDiscount = product.discount || 0;
    const priceAfterProductDiscount = originalPrice - (originalPrice * productDiscount / 100);

    let referralDiscountPercent = 0;
    let referralDiscountAmount = 0;
    let priceAfterReferralDiscount = priceAfterProductDiscount;
    let referralUsed = null;

    if (order.referralCode) {
      const referralTransaction = await db.referralTransaction.findFirst({
        where: {
          referral: {
            referral: order.referralCode,
          },
          userId,
          productId: product.id,
        },
        include: {
          referral: true,
        },
      });

      if (referralTransaction && referralTransaction.referral) {
        referralDiscountPercent = referralTransaction.percent;
        referralDiscountAmount = (priceAfterProductDiscount * referralDiscountPercent) / 100;
        priceAfterReferralDiscount = priceAfterProductDiscount - referralDiscountAmount;

        referralUsed = {
          referralCode: referralTransaction.referral.referral,
          usedBy: referralTransaction.userId,
          createdBy: referralTransaction.associateId,
        };
      }
    }

    const totalAmount = order.quantity * priceAfterReferralDiscount;

    return res.status(200).json({
      order,
      priceDetails: {
        originalPrice,
        productDiscount,
        priceAfterProductDiscount,
        referralDiscountPercent,
        referralDiscountAmount,
        priceAfterReferralDiscount,
        totalAmount,
      },
      referralUsed,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Buy Now from Cart

export const buyNowFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { paymentMode = "COD" } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.address) return res.status(400).json({ message: "User address not found" });

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            discount: true,
            referralPercentage: true,
            referralBy: true,
            sellerId: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderResults = [];
    let totalItems = 0;
    let grandTotal = 0;
    const referralUsage: any[] = [];

    for (const item of cartItems) {
      const product = item.product;
      const quantity = item.quantity || 1;
      const originalPrice = parseFloat(product.price);
      const productDiscount = product.discount || 0;
      const priceAfterDiscount = originalPrice - (originalPrice * productDiscount) / 100;

      let finalPrice = priceAfterDiscount;
      let referralCode = product.referralBy || null;

      if (referralCode) {
        const referral = await db.referral.findUnique({
          where: { referral: referralCode },
          include: { createdFor: true },
        });

        if (referral) {
          const referralPercent = product.referralPercentage ?? 0;
          const referralDiscountAmount = (priceAfterDiscount * referralPercent) / 100;
          finalPrice = priceAfterDiscount - referralDiscountAmount;

          referralUsage.push({
            referralCode: referral.referral,
            createdBy: referral.createdForId,
            usedBy: userId,
            productId: product.id,
            productName: product.name,
            price: finalPrice,
            commissionPercent: referralPercent,
          });

          await db.referralTransaction.create({
            data: {
              referralId: referral.id,
              associateId: referral.createdFor.id,
              userId,
              productId: product.id,
              productName: product.name,
              price: finalPrice,
              percent: referralPercent,
              commission: (referralPercent / 100) * priceAfterDiscount,
              sellerId: product.sellerId,
            },
          });

          if (!referral.usedBy.includes(userId)) {
            await db.referral.update({
              where: { id: referral.id },
              data: {
                usedBy: {
                  push: userId,
                },
              },
            });
          }
        }
      }

      // Fixed: Only one declaration of totalAmount
      const totalAmount = quantity * finalPrice;

      const order = await db.order.create({
        data: {
          userId,
          productId: product.id,
          quantity,
          totalAmount,
          address: user.address,
          paymentMode,
          status: "Pending",
          referralCode,
          sellerId: product.sellerId,
        },
      });

      orderResults.push({
        order,
        priceDetails: {
          originalPrice,
          productDiscount,
          priceAfterProductDiscount: priceAfterDiscount,
          referralDiscountPercent: referralCode ? product.referralPercentage ?? 0 : 0,
          priceAfterReferralDiscount: finalPrice,
          totalAmount,
        },
      });

      totalItems += quantity;
      grandTotal += totalAmount;
    }

    await db.cartItem.deleteMany({ where: { userId } });

    return res.status(201).json({
      message: "All cart items ordered successfully",
      totalItems,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      orders: orderResults,
      referralUsed: referralUsage.length > 0 ? referralUsage : null,
    });
  } catch (error) {
    console.error("BuyNowFromCart Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// Update order status

export const updateStatus = async function (req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.order.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateItems = async function (req: Request, res: Response) {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    await db.order.update({
      where: { id },
      data: { quantity },
    });

    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
