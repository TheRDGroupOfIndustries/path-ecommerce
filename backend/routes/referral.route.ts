import { Router } from "express";
import { createReferral , checkReferralCode , applyReferralCode, getReferralDetails,validateReferralCode } from "../controller/referral.controller.js";
import db from "../client/connect.js";
import {deleteReferral } from "../controller/referral.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = Router();

router.post("/create-or-update", async (req, res) => {
  await createReferral(req, res);
});

router.post("/check", isAuthenticated, async (req, res) => {
   await checkReferralCode(req, res);
});

router.get("/all", async (req, res) => {
  try {
    const referrals = await db.referral.findMany({
      include: {
        createdFor: {
          select: { id: true, name: true, email: true },
        },
        usedByUsers: {
          select: { id: true, name: true, email: true, createdAt: true },
        },
        transactions: {
          select: {
            percent: true,
            commission: true,
            userId: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    // Fetch all enquiries with referralCode
    const enquiries = await db.enquire.findMany({
      where: {
        referralCode: { not: null },
      },
      select: {
        referralCode: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true,
      },
    });

    // Format referrals
    const formatted = referrals.map((ref) => {
      // Unique userId per referral
      const seenPairs = new Set<string>();
      const uniqueTransactions = ref.transactions.filter((tx) => {
        const key = `${ref.id}_${tx.userId}`;
        if (!tx.userId || seenPairs.has(key)) return false;
        seenPairs.add(key);
        return true;
      });

      const totalRevenue = uniqueTransactions.reduce((sum, tx) => sum + tx.commission, 0);

      // Get enquiries matching this referral code
      const matchingEnquiries = enquiries.filter(
        (eq) => eq.referralCode === ref.referral
      );

      return {
        id: ref.id,
        referralCode: ref.referral,
        createdFor: ref.createdFor,

   
        usedAtSignupUsers: ref.usedByUsers,

       
        usedAtPurchaseUsers: uniqueTransactions.map((tx) => tx.user),

        usedInEnquiries: matchingEnquiries,

        totalRevenue,
        totalUsedBy: {
          signup: ref.usedByUsers.length,
          purchase: seenPairs.size,
          enquiry: matchingEnquiries.length,
        },
      };
    });

    const totalRevenue = formatted.reduce((sum, r) => sum + r.totalRevenue, 0);

    res.status(200).json({
      totalReferralCodes: referrals.length,
      totalRevenue,
      data: formatted,
    });
  } catch (err) {
    console.error("Error fetching referrals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/apply",isAuthenticated, async (req,res) => {
  await applyReferralCode(req,res);
});



router.delete("/:id", async (req, res) => {
  await deleteReferral(req, res);
});

// Get Full Referral Details (Per Associate)
router.get("/detail/:id", async (req, res) => {
   await getReferralDetails(req, res);
  });


router.get("/validate/:code", validateReferralCode);


// In referral.routes.js

router.get("/search-associate", async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name query parameter is required." });
  }

  try {
    const associates = await db.user.findMany({
      where: {
        role: "ASSOCIATE",
        name: {
          contains: name,
          mode: "insensitive",
        },
        associate: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        associate: {
          select: {
            id: true,
            level: true,
            percent: true,
            createdAt: true,
          },
        },
      },
    });

    res.status(200).json({ results: associates });
  } catch (error) {
    console.error("Error in search-associate route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
