// controller/tree.controller.ts

import { Request, Response } from "express";
import db from "../client/connect";

export const getHighLevelAssociates = async (req: Request, res: Response) => {
  try {
    // Get all commission levels >= 4
    const levels = await db.commissionLevel.findMany({
      where: {
        level: {
          gte: 2,
        },
      },
      orderBy: {
        level: "asc",
      },
    });

    const result = [];

    for (const level of levels) {
      // Fetch associates whose level <= current level
      const associates = await db.associate.findMany({
        where: {
          level: {
            lte: level.level,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      const formattedAssociates = associates.map((assoc) => ({
        id: assoc.id,
        userId: assoc.userId,
        userEmail: assoc.user.email,
        userName: assoc.user.name,
        phone: assoc.user.phone,
        level: assoc.level,
        commissionPercent: assoc.percent,
        createdAt: assoc.createdAt,
      }));

      result.push({
        level: level.level,
        percent: level.percent,
        associates: formattedAssociates,
      });
    }

    return res.status(200).json({
      success: true,
      levels: result,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// import { Request, Response } from "express";
// import db from "../client/connect"; 

// export const getHighLevelAssociates = async (req: Request, res: Response) => {
//   try {
//     const levels = await db.commissionLevel.findMany({
//       where: {
//         level: {
//           gte: 4,
//         },
//       },
//       include: {
//         associates: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 email: true,
//                 name: true,
//                 phone: true,
//               },
//             },
//             referredBy: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         level: "asc",
//       },
//     });

//     // Format the response
//     const formatted = levels.map((level) => ({
//       level: level.level,
//       percent: level.percent,
//       associates: level.associates.map((assoc) => ({
//         id: assoc.id,
//         userId: assoc.userId,
//         userEmail: assoc.user.email,
//         userName: assoc.user.name,
//         phone: assoc.user.phone,
//         level: assoc.level,
//         commissionPercent: assoc.commissionPercent,
//         referredBy: assoc.referredBy ? {
//           id: assoc.referredBy.id,
//           name: assoc.referredBy.name,
//           email: assoc.referredBy.email,
//         } : null,
//         createdAt: assoc.createdAt,
//       })),
//     }));

//     return res.status(200).json({
//       success: true,
//       levels: formatted,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
