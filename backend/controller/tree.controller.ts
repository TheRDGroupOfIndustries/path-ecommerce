import { Request, Response } from "express";
import db from "../client/connect.js";

export const getHighLevelAssociates = async (req: Request, res: Response) => {
  try {
    const levels = await db.commissionLevel.findMany({
      orderBy: { level: "asc" },
    });

    // Fetch all referrals with linked users and transactions
    const referrals = await db.referral.findMany({
      include: {
        createdFor: {
          select: { id: true, name: true, email: true, phone: true },
        },
        usedByUsers: {
          select: { id: true, name: true, email: true, phone: true, createdAt: true },
        },
        transactions: {
          select: {
            userId: true,
            user: {
              select: { id: true, name: true, email: true, phone: true, createdAt: true },
            },
          },
        },
      },
    });

    // Build referral usage map: associateId => purchases
    const referralUsageMap: Record<string, { purchase: any[] }> = {};

    for (const ref of referrals) {
      const associateId = ref.createdFor?.id;
      if (!associateId) continue;

      const purchasesSeen = new Set();
      const uniquePurchaseUsers = [];

      for (const tx of ref.transactions) {
        if (tx.userId && !purchasesSeen.has(tx.userId)) {
          purchasesSeen.add(tx.userId);
          uniquePurchaseUsers.push(tx.user);
        }
      }

      referralUsageMap[associateId] = {
        purchase: uniquePurchaseUsers,
      };
    }

    // Fetch all associates with user info
    const allAssociates = await db.associate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    // Group associates by level
    const associatesByLevel: Record<number, any[]> = {};
    for (const assoc of allAssociates) {
      if (!associatesByLevel[assoc.level]) {
        associatesByLevel[assoc.level] = [];
      }

      const usage = referralUsageMap[assoc.userId] || { purchase: [] };
      const revenuePerPurchase = 100; // Fixed value, replace with real amount if needed
      const totalRevenue = usage.purchase.length * revenuePerPurchase;
      const commissionEarned = (assoc.percent / 100) * totalRevenue;

      associatesByLevel[assoc.level].push({
        id: assoc.id,
        associaateId: assoc.userId,
        associaateEmail: assoc.user.email,
        associaateName: assoc.user.name,
        phone: assoc.user.phone,
        level: assoc.level,
        commissionPercent: assoc.percent,
        createdAt: assoc.createdAt,
        usedByUsers: usage,
        revenue: totalRevenue,
        commissionEarned: commissionEarned,
      });
    }

    // Recursive function to build level tree and distribute revenue
    const buildNestedLevels = (currentLevel: number): any => {
      const levelData = levels.find((lvl) => lvl.level === currentLevel);
      if (!levelData) return null;

      const associates = associatesByLevel[currentLevel] || [];
      const lowerLevel = buildNestedLevels(currentLevel - 1);

      // Step 1: Aggregate revenue from lower level
      let lowerLevelRevenue = 0;
      if (lowerLevel?.associates?.length) {
        for (const assoc of lowerLevel.associates) {
          lowerLevelRevenue += assoc.revenue || 0;
        }
      }

      // Step 2: Calculate this level's commission on lower level's revenue
      const thisLevelCommissionFromLower = (levelData.percent / 100) * lowerLevelRevenue;

      // Step 3: Prepare each associate’s data
      const updatedAssociates = associates.map((a) => {
        const totalCommission = a.commissionEarned + thisLevelCommissionFromLower;
        return {
          ...a,
          revenueFromLowerLevels: lowerLevelRevenue,
          commissionFromLowerLevels: parseFloat(thisLevelCommissionFromLower.toFixed(2)),
          totalCommission: parseFloat(totalCommission.toFixed(2)),
        };
      });

      const result: any = {
        level: currentLevel,
        percent: levelData.percent,
        associates: updatedAssociates,
      };

      if (lowerLevel) {
        result.lowerLevels = [lowerLevel];
        result.revenueShared = lowerLevelRevenue;
        result.commissionDistributed = {
          [`level_${currentLevel}`]: parseFloat(thisLevelCommissionFromLower.toFixed(2)),
        };
      }

      return result;
    };

    const topLevels = levels
      .filter((lvl) => lvl.level >= 2)
      .map((lvl) => buildNestedLevels(lvl.level));

    return res.status(200).json({
      success: true,
      levels: topLevels,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// import { Request, Response } from "express";
// import db from "../client/connect.js";

// export const getHighLevelAssociates = async (req: Request, res: Response) => {
//   try {
//     const levels = await db.commissionLevel.findMany({
//       orderBy: { level: "asc" },
//     });

//     // Fetch all referrals with linked users
//     const referrals = await db.referral.findMany({
//       include: {
//         createdFor: {
//           select: { id: true, name: true, email: true, phone: true },
//         },
//         usedByUsers: {
//           select: { id: true, name: true, email: true, phone: true, createdAt: true },
//         },
//         transactions: {
//           select: {
//             userId: true,
//             user: {
//               select: { id: true, name: true, email: true, phone: true, createdAt: true },
//             },
//           },
//         },
//       },
//     });

//     // Build a map from associateId (user.id) to all referral usage
//     const referralUsageMap: Record<string, {  purchase: any[] }> = {};

//     for (const ref of referrals) {
//       const associateId = ref.createdFor?.id;
//       if (!associateId) continue;

//       const purchasesSeen = new Set();
//       const uniquePurchaseUsers = [];

//       for (const tx of ref.transactions) {
//         if (tx.userId && !purchasesSeen.has(tx.userId)) {
//           purchasesSeen.add(tx.userId);
//           uniquePurchaseUsers.push(tx.user);
//         }
//       }

//       referralUsageMap[associateId] = {
//         purchase: uniquePurchaseUsers,
//       };
//     }

//     // Fetch all associates with user info
//     const allAssociates = await db.associate.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     // Group associates by their level
//     const associatesByLevel: Record<number, any[]> = {};
//     for (const assoc of allAssociates) {
//       if (!associatesByLevel[assoc.level]) {
//         associatesByLevel[assoc.level] = [];
//       }

//       const usage = referralUsageMap[assoc.userId] || {  purchase: [] };

//       associatesByLevel[assoc.level].push({
//         id: assoc.id,
//         associaateId: assoc.userId,
//         associaateEmail: assoc.user.email,
//         associaateName: assoc.user.name,
//         phone: assoc.user.phone,
//         level: assoc.level,
//         commissionPercent: assoc.percent,
//         createdAt: assoc.createdAt,
//         usedByUsers: usage, 
//       });
//     }

//     // Recursive nesting of levels
//     const buildNestedLevels = (currentLevel: number): any => {
//       const levelData = levels.find((lvl) => lvl.level === currentLevel);
//       if (!levelData) return null;

//       const associates = associatesByLevel[currentLevel] || [];
//       const lowerLevel = buildNestedLevels(currentLevel - 1);

//       const result: any = {
//         level: currentLevel,
//         percent: levelData.percent,
//         associates,
//       };

//       if (lowerLevel) {
//         result.lowerLevels = [lowerLevel];
//       }

//       return result;
//     };

//     const topLevels = levels
//       .filter((lvl) => lvl.level >= 2)
//       .map((lvl) => buildNestedLevels(lvl.level));

//     return res.status(200).json({
//       success: true,
//       levels: topLevels,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };




// import { Request, Response } from "express";
// import db from "../client/connect.js";

// export const getHighLevelAssociates = async (req: Request, res: Response) => {
//   try {
//     // Fetch all commission levels >= 1
//     const levels = await db.commissionLevel.findMany({
//       orderBy: {
//         level: "asc",
//       },
//     });

//     // Fetch all associates with user info
//     const allAssociates = await db.associate.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             createdAt: true,
//             createdReferrals: {
//               include: {
//                 usedByUsers: {
//                   select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     phone: true,
//                     createdAt: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // Group associates by level
//     const associatesByLevel: Record<number, any[]> = {};
//     for (const assoc of allAssociates) {
//       if (!associatesByLevel[assoc.level]) {
//         associatesByLevel[assoc.level] = [];
//       }

//       const usedByUsers = assoc.user.createdReferrals.flatMap((ref) => ref.usedByUsers);

//       associatesByLevel[assoc.level].push({
//         id: assoc.id,
//        associaateId: assoc.userId,
//        associaateEmail: assoc.user.email,
//        associaateName: assoc.user.name,
//         phone: assoc.user.phone,
//         level: assoc.level,
//         commissionPercent: assoc.percent,
//         createdAt: assoc.createdAt,
//         usedByUsers: usedByUsers || [],
//       });
//     }

//     // Recursive function to build nested structure
//     const buildNestedLevels = (currentLevel: number): any => {
//       const levelData = levels.find((lvl) => lvl.level === currentLevel);
//       if (!levelData) return null;

//       const associates = associatesByLevel[currentLevel] || [];
//       const lowerLevel = buildNestedLevels(currentLevel - 1);

//       const result: any = {
//         level: currentLevel,
//         percent: levelData.percent,
//         associates,
//       };

//       if (lowerLevel) {
//         result.lowerLevels = [lowerLevel];
//       }

//       return result;
//     };

//     // Start building nested levels from level >= 2
//     const topLevels = levels
//       .filter((lvl) => lvl.level >= 2)
//       .map((lvl) => buildNestedLevels(lvl.level));

//     return res.status(200).json({
//       success: true,
//       levels: topLevels,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


