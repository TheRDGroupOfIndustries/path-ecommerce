import { Router } from "express";
import { createOrUpdateReferral , checkReferralCode , applyReferralCode } from "../controller/referral.controller.js";
import db from "../client/connect.js";

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


export default router;
