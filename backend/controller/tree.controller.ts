import { Request, Response } from "express";
import db from "../client/connect.js";

export const getHighLevelAssociates = async (req: Request, res: Response) => {
  try {
    const levels = await db.commissionLevel.findMany({
      orderBy: { level: "asc" },
    });

    const referrals = await db.referral.findMany({
      include: {
        createdFor: {
          select: { id: true, name: true, email: true, phone: true },
        },
        usedByUsers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        transactions: {
          select: {
            userId: true,
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
        },
      },
    });

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

    const associatesByLevel: Record<number, any[]> = {};
    for (const assoc of allAssociates) {
      if (!associatesByLevel[assoc.level]) {
        associatesByLevel[assoc.level] = [];
      }

      const usage = referralUsageMap[assoc.userId] || { purchase: [] };
      const revenuePerPurchase = 100;
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
        referralPercent: parseFloat(commissionEarned.toFixed(2)),
      });
    }
// const buildNestedLevels = (currentLevel: number): any => {
//   const levelData = levels.find((lvl) => lvl.level === currentLevel);
//   if (!levelData) return null;

//   const associates = associatesByLevel[currentLevel] || [];
//   const lowerLevel = buildNestedLevels(currentLevel - 1);

//   //  Aggregate revenue from lower levels recursively. kachr h ye wala 😭
//   let totalLowerRevenue = 0;
//   const levelWiseRevenue: Record<string, number> = {};

//   if (lowerLevel?.associates?.length) {
//     for (const assoc of lowerLevel.associates) {
//       const assocLevel = assoc.level;
//       const assocRevenue = assoc.revenue || 0;

//       // Track per-level revenue: level1Revenue, level2Revenue, .... or jo bhi ho
//       const key = `level${assocLevel}Revenue`;
//       levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;

//       totalLowerRevenue += assocRevenue;

//       // Add any nested lower-level revenue fields from the associate
//       for (const k in assoc) {
//         if (k.startsWith("level") && k.endsWith("Revenue")) {
//           levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
//           totalLowerRevenue += assoc[k];
//         }
//       }
//     }
//   }

//   // Prepare associates with combined revenue and commission
//   const updatedAssociates = associates.map((a) => {
//    const fullRevenue = a.revenue + totalLowerRevenue;
//     const totalCommissionInRupee = parseFloat(((levelData.percent / 100) * fullRevenue).toFixed(2));
//     const totalCommissionInPercent = parseFloat(((totalCommissionInRupee / fullRevenue) * 100).toFixed(2));

//       return {
//       ...a,
//       ...levelWiseRevenue,
//       revenueFromLowerLevels: totalLowerRevenue,
//       finalRevenue: fullRevenue,
//       totalCommissionInRupee,
//       totalCommissionInPercent,
//     };

//   });

//   const result: any = {
//     level: currentLevel,
//     percent: levelData.percent,
//     associates: updatedAssociates,
//   };

//   if (lowerLevel) {
//     result.lowerLevels = [lowerLevel];
//     result.revenueShared = totalLowerRevenue;
//     result.commissionDistributed = {
//       [`level_${currentLevel}`]: parseFloat(((levelData.percent / 100) * totalLowerRevenue).toFixed(2)),
//     };
//   }

//   return result;
// };

const buildNestedLevels = (currentLevel: number, parentId: string | null = null): any => {
  const levelData = levels.find((lvl) => lvl.level === currentLevel);
  if (!levelData) return null;

  const associates = associatesByLevel[currentLevel] || [];
  const lowerLevel = buildNestedLevels(currentLevel - 1, "nested");

  let totalLowerRevenue = 0;
  const levelWiseRevenue: Record<string, number> = {};

  if (lowerLevel?.associates?.length) {
    for (const assoc of lowerLevel.associates) {
      const assocLevel = assoc.level;
      const assocRevenue = assoc.revenue || 0;

      const key = `level${assocLevel}Revenue`;
      levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
      totalLowerRevenue += assocRevenue;

      for (const k in assoc) {
        if (k.startsWith("level") && k.endsWith("Revenue")) {
          levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
          totalLowerRevenue += assoc[k];
        }
      }
    }
  }

  // Prepare associates with full revenue + commission
  const updatedAssociates = associates.map((a) => {
    const fullRevenue = a.revenue + totalLowerRevenue;
    const isTopLevel = parentId === null; // Top-level flag

const commissionPercent = isTopLevel
  ? getOverriddenCommissionPercent(currentLevel) ?? levelData.percent
  : levelData.percent;


    const totalCommissionInRupee = parseFloat(
  ((commissionPercent / 100) * fullRevenue).toFixed(2)
);

const totalCommissionInPercent = parseFloat(
  ((totalCommissionInRupee / fullRevenue) * 100).toFixed(2)
);


    const result: any = {
      ...a,
      ...levelWiseRevenue,
      revenueFromLowerLevels: totalLowerRevenue,
      finalRevenue: fullRevenue,
      totalCommissionInRupee,
      totalCommissionInPercent,
    };

    // Only top-level should show editable commission percent
   if (isTopLevel) {
  result.commissionPercent = commissionPercent;
  result.totalCommissionInPercent = commissionPercent;
}

    return result;
  });

  const result: any = {
    level: currentLevel,
    percent: levelData.percent,
    associates: updatedAssociates,
  };

  if (lowerLevel) {
    result.lowerLevels = [lowerLevel];
    result.revenueShared = totalLowerRevenue;
    result.commissionDistributed = {
      [`level_${currentLevel}`]: parseFloat(((levelData.percent / 100) * totalLowerRevenue).toFixed(2)),
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



const overriddenCommissions: Record<number, number> = {}; // key: level, value: new percent

export const updateTopLevelCommissionPercent = (req: Request, res: Response) => {
  const { level, newPercent } = req.body;

  if (typeof level !== 'number' || typeof newPercent !== 'number') {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  overriddenCommissions[level] = newPercent;

  return res.status(200).json({ success: true, message: `Commission updated for level ${level}` });
};

export const getOverriddenCommissionPercent = (level: number): number | undefined => {
  return overriddenCommissions[level];
};