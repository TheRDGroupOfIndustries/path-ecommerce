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
        transactions: {
          select: {
            percent: true,
            commission: true,
            userId: true, 
          }
        }
      }
    });

    const filteredReferrals = referrals.map(ref => {
      const seenUsers = new Set();
      const uniqueTransactions = ref.transactions.filter(tx => {
        if (!tx.userId || seenUsers.has(tx.userId)) return false;
        seenUsers.add(tx.userId);
        return true;
      });

      const totalRevenue = uniqueTransactions.reduce((sum, tx) => sum + tx.commission, 0);

      return {
        ...ref,
        transactions: uniqueTransactions,
        totalRevenue, 
      };
    });

    res.status(200).json(filteredReferrals);
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


export default router;
