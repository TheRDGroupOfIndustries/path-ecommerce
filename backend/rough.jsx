// export const getHighLevelAssociates = async (req: Request, res: Response) => {
//   try {
//     const levels = await db.commissionLevel.findMany({
//       orderBy: { level: "asc" },
//     });

//     const referrals = await db.referral.findMany({
//       include: {
//         createdFor: {
//           select: { id: true, name: true, email: true, phone: true },
//         },
//         usedByUsers: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             createdAt: true,
//           },
//         },
//         transactions: {
//           select: {
//             userId: true,
//             commission: true,
//             price: true,
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 phone: true,
//                 createdAt: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const referralUsageMap: Record<string, { purchase: any[] }> = {};

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

//     const associatesByLevel: Record<number, any[]> = {};
//     for (const assoc of allAssociates) {
//       if (!associatesByLevel[assoc.level]) {
//         associatesByLevel[assoc.level] = [];
//       }

//       const usage = referralUsageMap[assoc.userId] || { purchase: [] };

//       const userTransactions = referrals
//         .filter((ref) => ref.createdFor?.id === assoc.userId)
//         .flatMap((ref) => ref.transactions || [])
//         .filter((tx) => tx.userId);

//       const totalRevenue = userTransactions.reduce(
//         (sum, tx) => sum + (tx.commission || 0),
//         0
//       );

//       const commissionEarned = (assoc.percent / 100) * totalRevenue;

//       associatesByLevel[assoc.level].push({
//         id: assoc.id,
//         associaateId: assoc.userId,
//         associaateEmail: assoc.user.email,
//         associaateName: assoc.user.name,
//         phone: assoc.user.phone,
//         level: assoc.level,
//         referralPercent: assoc.percent,
//         createdAt: assoc.createdAt,
//         usedByUsers: usage,
//         revenue: totalRevenue,
//         commissionEarned: parseFloat(commissionEarned.toFixed(2)),
//       });
//     }

// const buildNestedLevels = async (currentLevel: number, parentId: string | null = null): Promise<any> => {
//   const levelData = levels.find((lvl) => lvl.level === currentLevel);
//   if (!levelData) return null;

//   const associates = associatesByLevel[currentLevel] || [];
//   const lowerLevel = await buildNestedLevels(currentLevel - 1, "nested");

//   let totalLowerRevenue = 0;
//   const levelWiseRevenue: Record<string, number> = {};

//   if (lowerLevel?.associates?.length) {
//     for (const assoc of lowerLevel.associates) {
//       const assocLevel = assoc.level;
//       const assocRevenue = assoc.revenue || 0;
//       const key = `level${assocLevel}Revenue`;
//       levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
//       totalLowerRevenue += assocRevenue;

//       for (const k in assoc) {
//         if (k.startsWith("level") && k.endsWith("Revenue")) {
//           levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
//           totalLowerRevenue += assoc[k];
//         }
//       }
//     }
//   }

//   const updatedAssociates = await Promise.all(
//     associates.map(async (a) => {
//       const lowerLevel = await buildNestedLevels(currentLevel - 1, a.associaateId);
//       let totalLowerRevenue = 0;
//       const levelWiseRevenue: Record<string, number> = {};

//       if (lowerLevel?.associates?.length) {
//         for (const assoc of lowerLevel.associates) {
//           const assocLevel = assoc.level;
//           const assocRevenue = assoc.revenue || 0;
//           const key = `level${assocLevel}Revenue`;
//           levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
//           totalLowerRevenue += assocRevenue;

//           for (const k in assoc) {
//             if (k.startsWith("level") && k.endsWith("Revenue")) {
//               levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
//               totalLowerRevenue += assoc[k];
//             }
//           }
//         }
//       }

//       const fullRevenue = a.revenue + totalLowerRevenue;
//       const isTopLevel = parentId === null;
      
//       let commissionPercent;
//       if (isTopLevel) {
//         commissionPercent =
//           (await getOverriddenCommissionPercent(a.associaateId, currentLevel)) ??
//           levelData.percent ??
//           0;
//       } else {
//         commissionPercent =
//           (await getLocalOverride(parentId!, a.associaateId, currentLevel)) ??
//           levelData.percent ??
//           0;
//       }

//       const totalCommissionInRupee = parseFloat(
//         ((commissionPercent / 100) * fullRevenue).toFixed(2)
//       );

//       const totalCommissionInPercent = parseFloat(
//         ((totalCommissionInRupee / fullRevenue) * 100).toFixed(2)
//       );

//   const result: any = {
//   ...a,
//   ...levelWiseRevenue,
//   revenueFromLowerLevels: totalLowerRevenue,
//   finalRevenue: fullRevenue,
//   totalCommissionInRupee,
//   totalCommissionInPercent,
//   commissionPercent,
//   percent: isTopLevel ? levelData.percent : commissionPercent,
// };


//       if (lowerLevel) {
//         result.lowerLevels = [lowerLevel];
//       }

//       return result;
//     })
//   );

//   const result: any = {
//     level: currentLevel,
//     // FIXED: Always use the original level percent, not the associate's commission percent
//     percent: levelData.percent, // This should always be the original level percent
//     associates: updatedAssociates,
//   };

//   if (lowerLevel) {
//     result.revenueShared = totalLowerRevenue;
//     result.commissionDistributed = {
//       [`level_${currentLevel}`]: parseFloat(
//         ((levelData.percent / 100) * totalLowerRevenue).toFixed(2)
//       ),
//     };
//   }

//   return result;
// };


//     const topLevels = await Promise.all(
//       levels
//         .filter((lvl) => lvl.level >= 2)
//         .map((lvl) => buildNestedLevels(lvl.level))
//     );

//     return res.status(200).json({
//       success: true,
//       levels: topLevels,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };






// main-----------------------------------------------------


// const getLocalOverride = async (
//   parentAssociateId: string,
//   targetAssociateId: string,
//   overrideLevel: number
// ): Promise<number | null> => {
//   const override = await db.commissionOverrideLocal.findFirst({
//     where: {
//       parentAssociateId,
//       targetAssociateId,
//       overrideLevel,
//     },
//   });

//   return override?.percentOverride ?? null;
// };


// export const updateLevelPercent = async (req: Request, res: Response) => {
//   try {
//     const { parentAssociateId, targetAssociateId, overrideLevel, percentOverride } = req.body;

//     if (!parentAssociateId || !targetAssociateId || overrideLevel == null || percentOverride == null) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     // Check if override already exists
//     const existingOverride = await db.commissionOverrideLocal.findFirst({
//       where: {
//         parentAssociateId,
//         targetAssociateId,
//         overrideLevel,
//       },
//     });

//     let override;

//     if (existingOverride) {
//       // Update existing override
//       override = await db.commissionOverrideLocal.update({
//         where: { id: existingOverride.id },
//         data: { percentOverride },
//       });
//     } else {
//       // Create new override
//       override = await db.commissionOverrideLocal.create({
//         data: {
//           parentAssociateId,
//           targetAssociateId,
//           overrideLevel,
//           percentOverride,
//         },
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Level percent updated locally.",
//       override,
//     });
//   } catch (err) {
//     console.error("Error in override update:", err);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };


// export const getHighLevelAssociates = async (req: Request, res: Response) => {
//   try {
//     const levels = await db.commissionLevel.findMany({
//       orderBy: { level: "asc" },
//     });

//     const referrals = await db.referral.findMany({
//       include: {
//         createdFor: {
//           select: { id: true, name: true, email: true, phone: true },
//         },
//         usedByUsers: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             createdAt: true,
//           },
//         },
//         transactions: {
//           select: {
//             userId: true,
//             commission: true,
//             price: true,
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 phone: true,
//                 createdAt: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const referralUsageMap: Record<string, { purchase: any[] }> = {};

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

//     const associatesByLevel: Record<number, any[]> = {};
//     for (const assoc of allAssociates) {
//       if (!associatesByLevel[assoc.level]) {
//         associatesByLevel[assoc.level] = [];
//       }

//       const usage = referralUsageMap[assoc.userId] || { purchase: [] };

//       const userTransactions = referrals
//         .filter((ref) => ref.createdFor?.id === assoc.userId)
//         .flatMap((ref) => ref.transactions || [])
//         .filter((tx) => tx.userId);

//       const totalRevenue = userTransactions.reduce(
//         (sum, tx) => sum + (tx.commission || 0),
//         0
//       );

//       const commissionEarned = (assoc.percent / 100) * totalRevenue;

//       associatesByLevel[assoc.level].push({
//         id: assoc.id,
//         associaateId: assoc.userId,
//         associaateEmail: assoc.user.email,
//         associaateName: assoc.user.name,
//         phone: assoc.user.phone,
//         level: assoc.level,
//         referralPercent: assoc.percent,
//         createdAt: assoc.createdAt,
//         usedByUsers: usage,
//         revenue: totalRevenue,
//         commissionEarned: parseFloat(commissionEarned.toFixed(2)),
//       });
//     }


// const buildNestedLevels = async (currentLevel: number, parentId: string | null = null): any => {
//   const levelData = levels.find((lvl) => lvl.level === currentLevel);
//   if (!levelData) return null;

//   const associates = associatesByLevel[currentLevel] || [];
//   const lowerLevel = await buildNestedLevels(currentLevel - 1, "nested");

//   let totalLowerRevenue = 0;
//   const levelWiseRevenue: Record<string, number> = {};

//   if (lowerLevel?.associates?.length) {
//     for (const assoc of lowerLevel.associates) {
//       const assocLevel = assoc.level;
//       const assocRevenue = assoc.revenue || 0;

//       const key = `level${assocLevel}Revenue`;
//       levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
//       totalLowerRevenue += assocRevenue;

//       for (const k in assoc) {
//         if (k.startsWith("level") && k.endsWith("Revenue")) {
//           levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
//           totalLowerRevenue += assoc[k];
//         }
//       }
//     }
//   }

//   const updatedAssociates = await Promise.all(
//     associates.map(async (a) => {
//       const fullRevenue = a.revenue + totalLowerRevenue;
//       const isTopLevel = parentId === null;

//       let commissionPercent: number;

//       if (isTopLevel) {
//         // Use global override if top level
//         commissionPercent =
//           (await getOverriddenCommissionPercent(a.associaateId, currentLevel)) ??
//           levelData.percent ??
//           0;
//       } else {
//         // Use local override for lower levels
//         const localOverride = await getLocalOverride(parentId!, a.associaateId, currentLevel);
//         commissionPercent = localOverride ?? levelData.percent ?? 0;
//       }

//       const totalCommissionInRupee = parseFloat(((commissionPercent / 100) * fullRevenue).toFixed(2));
//       const totalCommissionInPercent = parseFloat(
//         ((totalCommissionInRupee / fullRevenue) * 100).toFixed(2)
//       );

//       const result: any = {
//         ...a,
//         ...levelWiseRevenue,
//         revenueFromLowerLevels: totalLowerRevenue,
//         finalRevenue: fullRevenue,
//         totalCommissionInRupee,
//         totalCommissionInPercent,
//       };

//       // Set only for display (used by frontend maybe)
//       if (isTopLevel) {
//         result.commissionPercent = commissionPercent;
//         result.totalCommissionInPercent = commissionPercent;
//       }

//       return result;
//     })
//   );

//   const effectivePercent = parentId
//     ? (await getLocalOverride(parentId, updatedAssociates[0]?.associaateId, currentLevel)) ??
//       levelData.percent
//     : levelData.percent;

//   const result: any = {
//     level: currentLevel,
//     percent: effectivePercent, // 👈 this ensures local override percent only reflects in lowerLevels
//     associates: updatedAssociates,
//   };

//   if (lowerLevel) {
//     result.lowerLevels = [lowerLevel];
//     result.revenueShared = totalLowerRevenue;
//     result.commissionDistributed = {
//       [`level_${currentLevel}`]: parseFloat(
//         ((effectivePercent / 100) * totalLowerRevenue).toFixed(2)
//       ),
//     };
//   }

//   return result;
// };


// const topLevels = await Promise.all(
//   levels
//     .filter((lvl) => lvl.level >= 2)
//     .map((lvl) => buildNestedLevels(lvl.level))
// );
//     return res.status(200).json({
//       success: true,
//       levels: topLevels,
//     });
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
