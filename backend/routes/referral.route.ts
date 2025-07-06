import { Router } from "express";
import { createOrUpdateReferral , checkReferralCode , applyReferralCode } from "../controller/referral.controller.js";
import db from "../client/connect.js";
import { getAllReferralRevenue ,deleteReferral } from "../controller/referral.controller.js";

const router = Router();

router.post("/create-or-update", async (req, res) => {
  await createOrUpdateReferral(req, res);
});

router.post("/check", async (req, res) => {
   await checkReferralCode(req, res);
});

router.get("/all", async (req, res) => {
  try {
    const referrals = await db.referral.findMany({
      select: {
        id:true,
        referral: true,
        createdForId: true,
        usedBy: true,
        createdAt: true
      }
    });
    res.status(200).json(referrals);
  } catch (err) {
    console.error("Error fetching referrals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/apply", async (req,res) => {
  await applyReferralCode(req,res);
});


router.get("/revenue", async (req, res) => {
  await getAllReferralRevenue(req, res);
});



router.delete("/:id", async (req, res) => {
  await deleteReferral(req, res);
});



export default router;
