import { Request, Response } from "express";
import db from "../client/connect.js";


export const searchAssociates = async (req: Request, res: Response) => {
  try {
    const query = (req.query.name as string)?.trim();

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters.",
      });
    }

    const results = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } },
        ],
        associate: {
          isNot: null, // Only users with associate entries
        },
      },
      include: {
        associate: true,
      },
    });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAssociateById = async (req: Request, res: Response) => {
  const associateId = req.params.id;

  if (!associateId) {
    return res.status(400).json({ success: false, message: "Associate ID is required" });
  }

  try {
    // Step 1: Fetch the associate entry
    const associate = await db.associate.findUnique({
      where: { id: associateId },
      include: { user: true }, // include user data
    });

    if (!associate || !associate.user) {
      return res.status(404).json({ success: false, message: "Associate not found" });
    }

    const userId = associate.userId;

    // Step 2: Update the user role from ASSOCIATE to USER
    await db.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });

    // Step 3: Delete referrals created for this associate
    const referrals = await db.referral.findMany({
      where: { createdForId: userId },
      select: { id: true },
    });

    const referralIds = referrals.map((r) => r.id);

    if (referralIds.length > 0) {
      // Delete referral transactions
      await db.referralTransaction.deleteMany({
        where: {
          referralId: { in: referralIds },
        },
      });

      // Delete referrals
      await db.referral.deleteMany({
        where: {
          id: { in: referralIds },
        },
      });
    }

    // Step 4: Delete Associate record
    await db.associate.delete({
      where: { id: associateId },
    });

    return res.status(200).json({
      success: true,
      message: "Associate converted to user and deleted successfully.",
    });

  } catch (error) {
    console.error("Delete error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete associate. They are referenced in another table.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during associate deletion.",
    });
  }
};

export const updateCommissionPercent = async (req: Request, res: Response) => {
  const { associateId, level, newPercent } = req.body;

  if (
    typeof level !== 'number' ||
    typeof newPercent !== 'number' ||
    typeof associateId !== 'string'
  ) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    await db.commissionOverride.upsert({
      where: {
        associateId_level: {
          associateId,
          level,
        },
      },
      update: { newPercent },
      create: { associateId, level, newPercent },
    });

    return res.status(200).json({
      success: true,
      message: `Commission successfully updated for associate ${associateId} at level ${level}`,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: "Database update failed" });
  }
};

export const getOverriddenCommissionPercent = async (
  associateId: string,
  level: number
): Promise<number | undefined> => {
  try {
    const override = await db.commissionOverride.findUnique({
      where: {
        associateId_level: {
          associateId,
          level,
        },
      },
    });

    return override?.newPercent;
  } catch (error) {
    console.error("Override fetch error:", error);
    return undefined;
  }
};


const getLocalOverride = async (
  parentAssociateId: string,
  targetAssociateId: string,
  overrideLevel: number
): Promise<number | null> => {
  try {
    const override = await db.commissionOverrideLocal.findFirst({
      where: {
        parentAssociateId,
        targetAssociateId,
        overrideLevel,
      },
    });
    return override?.percentOverride ?? null;
  } catch (error) {
    console.error("Local override fetch error:", error);
    return null;
  }
};

export const updateLevelPercent = async (req: Request, res: Response) => {
  try {
    const { parentAssociateId, targetAssociateId, overrideLevel, percentOverride } = req.body;

    if (!parentAssociateId || !targetAssociateId || overrideLevel == null || percentOverride == null) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if override already exists
    const existingOverride = await db.commissionOverrideLocal.findFirst({
      where: {
        parentAssociateId,
        targetAssociateId,
        overrideLevel,
      },
    });

    let override;
    if (existingOverride) {
      // Update existing override
      override = await db.commissionOverrideLocal.update({
        where: { id: existingOverride.id },
        data: { percentOverride },
      });
    } else {
      // Create new override
      override = await db.commissionOverrideLocal.create({
        data: {
          parentAssociateId,
          targetAssociateId,
          overrideLevel,
          percentOverride,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Commission percent updated locally.",
      override,
    });
  } catch (err) {
    console.error("Error in override update:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

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
            commission: true,
            price: true,
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
      const userTransactions = referrals
        .filter((ref) => ref.createdFor?.id === assoc.userId)
        .flatMap((ref) => ref.transactions || [])
        .filter((tx) => tx.userId);

      const totalRevenue = userTransactions.reduce(
        (sum, tx) => sum + (tx.commission || 0),
        0
      );

      const commissionEarned = (assoc.percent / 100) * totalRevenue;

      associatesByLevel[assoc.level].push({
        id: assoc.id,
        associaateId: assoc.userId,
        associaateEmail: assoc.user.email,
        associaateName: assoc.user.name,
        phone: assoc.user.phone,
        level: assoc.level,
        referralPercent: assoc.percent,
        createdAt: assoc.createdAt,
        usedByUsers: usage,
        revenue: totalRevenue,
        commissionEarned: parseFloat(commissionEarned.toFixed(2)),
      });
    }

    // Fixed buildNestedLevels function with proper hierarchy depth tracking
    const buildNestedLevels = async (
      currentLevel: number,
      parentAssociateId: string | null = null,
      specificAssociateId: string | null = null,
      hierarchyDepth: number = 0 // NEW: Track how deep we are in the hierarchy
    ): Promise<any> => {
      const levelData = levels.find((lvl) => lvl.level === currentLevel);
      if (!levelData) return null;

      let associates = associatesByLevel[currentLevel] || [];
      
      // If building for a specific associate, filter to only that associate
      if (specificAssociateId) {
        associates = associates.filter(assoc => assoc.associaateId === specificAssociateId);
      }

      // Build lower levels for each associate individually
      const updatedAssociates = await Promise.all(
        associates.map(async (associate) => {
          // Build lower levels specifically for this associate
          const lowerLevelsForThisAssociate = [];
          
          // Get all levels below current level
          const lowerLevelNumbers = levels
            .filter(lvl => lvl.level < currentLevel)
            .map(lvl => lvl.level)
            .sort((a, b) => b - a); // descending order

          for (const lowerLevelNum of lowerLevelNumbers) {
            const lowerLevel = await buildNestedLevels(
              lowerLevelNum, 
              associate.associaateId, // This associate becomes the parent
              null, // Don't filter by specific associate for lower levels
              hierarchyDepth + 1 // Increment depth
            );
            if (lowerLevel && lowerLevel.associates && lowerLevel.associates.length > 0) {
              lowerLevelsForThisAssociate.push(lowerLevel);
            }
          }

          // Calculate revenue from lower levels for THIS specific associate
          let totalLowerRevenue = 0;
          const levelWiseRevenue: Record<string, number> = {};

          for (const lowerLevel of lowerLevelsForThisAssociate) {
            if (lowerLevel?.associates?.length) {
              for (const assoc of lowerLevel.associates) {
                const assocLevel = assoc.level;
                const assocRevenue = assoc.revenue || 0;
                const key = `level${assocLevel}Revenue`;
                levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
                totalLowerRevenue += assocRevenue;

                // Add revenue from even lower levels
                for (const k in assoc) {
                  if (k.startsWith("level") && k.endsWith("Revenue")) {
                    levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
                    totalLowerRevenue += assoc[k];
                  }
                }
              }
            }
          }

          const fullRevenue = associate.revenue + totalLowerRevenue;
          const isTopLevel = parentAssociateId === null;
          
          let commissionPercent: number;
          if (isTopLevel) {
            // For top level, use global override
            commissionPercent = 
              (await getOverriddenCommissionPercent(associate.associaateId, currentLevel)) ??
              levelData.percent ?? 0;
          } else {
            // FIXED: Only apply local overrides for direct parent-child relationships (depth 1)
            // Local overrides should not apply when we're nested deeper in the hierarchy
            let localOverride = null;
            if (hierarchyDepth === 1) {
              // Only check for local override if this is a direct parent-child relationship
              localOverride = await getLocalOverride(
                parentAssociateId!,
                associate.associaateId,
                currentLevel
              );
            }
            commissionPercent = localOverride ?? levelData.percent ?? 0;
          }

          const totalCommissionInRupee = parseFloat(
            ((commissionPercent / 100) * fullRevenue).toFixed(2)
          );
          const totalCommissionInPercent = fullRevenue > 0 
            ? parseFloat(((totalCommissionInRupee / fullRevenue) * 100).toFixed(2))
            : 0;

          const result: any = {
            ...associate,
            ...levelWiseRevenue,
            revenueFromLowerLevels: totalLowerRevenue,
            finalRevenue: fullRevenue,
            totalCommissionInRupee,
            totalCommissionInPercent,
            commissionPercent,
          };

          // Add lower levels to this associate if they exist
          if (lowerLevelsForThisAssociate.length > 0) {
            result.lowerLevels = lowerLevelsForThisAssociate;
            result.revenueShared = totalLowerRevenue;
            result.commissionDistributed = {
              [`level_${currentLevel}`]: parseFloat(
                ((commissionPercent / 100) * totalLowerRevenue).toFixed(2)
              ),
            };
          }

          return result;
        })
      );

      // FIXED: Only apply level overrides for direct parent-child relationships
      let effectivePercent = levelData.percent;
      if (parentAssociateId && updatedAssociates.length > 0 && hierarchyDepth === 1) {
        // Only check for overrides if this is a direct parent-child relationship
        const overrides = await Promise.all(
          updatedAssociates.map(associate => 
            getLocalOverride(parentAssociateId, associate.associaateId, currentLevel)
          )
        );
        
        // If all associates under this level share the same override, apply it
        const allSameOverride = overrides.every(p => p !== null && p === overrides[0]);
        if (allSameOverride && overrides[0] !== null) {
          effectivePercent = overrides[0];
        }
      }

      const result: any = {
        level: currentLevel,
        percent: effectivePercent,
        associates: updatedAssociates,
      };

      return result;
    };
 
    const topLevels = await Promise.all(
      levels
        .filter((lvl) => lvl.level >= 2)
        .sort((a, b) => a.level - b.level) // Start from highest level
        .map((lvl) => buildNestedLevels(lvl.level, null, null, 0)) // Start with depth 0
    );

    // Filter out null results
    const validTopLevels = topLevels.filter(level => level !== null);

    return res.status(200).json({
      success: true,
      levels: validTopLevels,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





// const buildNestedLevels = async (
//   currentLevel: number,
//   parentAssociateId: string | null = null,
//   specificAssociateId: string | null = null,
//   hierarchyDepth: number = 0,
//   visitedSet: Set<string> = new Set(), // Tracks path
//   globallyAddedSet: Set<string> = new Set() // NEW: Prevent duplicate associates globally
// ): Promise<any> => {
//   const levelData = levels.find((lvl) => lvl.level === currentLevel);
//   if (!levelData) return null;

//   let associates = associatesByLevel[currentLevel] || [];

//   if (specificAssociateId) {
//     associates = associates.filter(assoc => assoc.associaateId === specificAssociateId);
//   }

//   const updatedAssociates = (
//     await Promise.all(
//       associates.map(async (associate) => {
//         // ❌ Skip if already visited in this path or globally added
//         if (visitedSet.has(associate.associaateId) || globallyAddedSet.has(associate.associaateId)) {
//           return null;
//         }

//         // ✅ Mark as visited for this path and globally
//         const newVisitedSet = new Set(visitedSet);
//         newVisitedSet.add(associate.associaateId);
//         globallyAddedSet.add(associate.associaateId);

//         // Recursively build lower levels
//         const lowerLevelsForThisAssociate = [];
//         const lowerLevelNumbers = levels
//           .filter(lvl => lvl.level < currentLevel)
//           .map(lvl => lvl.level)
//           .sort((a, b) => b - a);

//         for (const lowerLevelNum of lowerLevelNumbers) {
//           const lowerLevel = await buildNestedLevels(
//             lowerLevelNum,
//             associate.associaateId,
//             null,
//             hierarchyDepth + 1,
//             newVisitedSet,
//             globallyAddedSet // 🔄 pass global set down
//           );
//           if (lowerLevel?.associates?.length > 0) {
//             lowerLevelsForThisAssociate.push(lowerLevel);
//           }
//         }

//         // Revenue aggregation
//         let totalLowerRevenue = 0;
//         const levelWiseRevenue: Record<string, number> = {};

//         for (const lowerLevel of lowerLevelsForThisAssociate) {
//           for (const assoc of lowerLevel.associates || []) {
//             const assocRevenue = assoc.revenue || 0;
//             const key = `level${assoc.level}Revenue`;

//             levelWiseRevenue[key] = (levelWiseRevenue[key] || 0) + assocRevenue;
//             totalLowerRevenue += assocRevenue;

//             // Add nested revenue keys
//             for (const k in assoc) {
//               if (k.startsWith("level") && k.endsWith("Revenue")) {
//                 levelWiseRevenue[k] = (levelWiseRevenue[k] || 0) + assoc[k];
//                 totalLowerRevenue += assoc[k];
//               }
//             }
//           }
//         }

//         const fullRevenue = associate.revenue + totalLowerRevenue;
//         const isTopLevel = parentAssociateId === null;

//         // Determine commission percent
//         let commissionPercent: number;
//         if (isTopLevel) {
//           commissionPercent = (
//             await getOverriddenCommissionPercent(associate.associaateId, currentLevel)
//           ) ?? levelData.percent ?? 0;
//         } else {
//           let localOverride = null;
//           if (hierarchyDepth === 1) {
//             localOverride = await getLocalOverride(
//               parentAssociateId!,
//               associate.associaateId,
//               currentLevel
//             );
//           }
//           commissionPercent = localOverride ?? levelData.percent ?? 0;
//         }

//         const totalCommissionInRupee = parseFloat(
//           ((commissionPercent / 100) * fullRevenue).toFixed(2)
//         );
//         const totalCommissionInPercent = fullRevenue > 0
//           ? parseFloat(((totalCommissionInRupee / fullRevenue) * 100).toFixed(2))
//           : 0;

//         const result: any = {
//           ...associate,
//           ...levelWiseRevenue,
//           revenueFromLowerLevels: totalLowerRevenue,
//           finalRevenue: fullRevenue,
//           totalCommissionInRupee,
//           totalCommissionInPercent,
//           commissionPercent,
//         };

//         if (lowerLevelsForThisAssociate.length > 0) {
//           result.lowerLevels = lowerLevelsForThisAssociate;
//           result.revenueShared = totalLowerRevenue;
//           result.commissionDistributed = {
//             [`level_${currentLevel}`]: parseFloat(
//               ((commissionPercent / 100) * totalLowerRevenue).toFixed(2)
//             ),
//           };
//         }

//         return result;
//       })
//     )
//   ).filter(Boolean); // Remove nulls

//   // Handle effective percent override
//   let effectivePercent = levelData.percent;
//   if (parentAssociateId && updatedAssociates.length > 0 && hierarchyDepth === 1) {
//     const overrides = await Promise.all(
//       updatedAssociates.map(associate =>
//         getLocalOverride(parentAssociateId, associate.associaateId, currentLevel)
//       )
//     );
//     const allSameOverride = overrides.every(p => p !== null && p === overrides[0]);
//     if (allSameOverride && overrides[0] !== null) {
//       effectivePercent = overrides[0];
//     }
//   }

//   return {
//     level: currentLevel,
//     percent: effectivePercent,
//     associates: updatedAssociates,
//   };
// };



    // Build the hierarchy starting from top levels
   