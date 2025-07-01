// import { Router } from "express";
// import { createOrUpdateReferral } from "../controller/referral.controller.js";

// const router = Router();

// router.post("/create-or-update",  async (req, res) => {
//   await createOrUpdateReferral(req, res)
// });

// export default router;



import { Router } from "express";
import {
  createOrUpdateReferral,
  getReferralCode,
} from "../controller/referral.controller.js";

const router = Router();

router.post("/create-or-update", async (req, res) => {
  await createOrUpdateReferral(req, res);
});

router.get("/:associateId", async (req, res) => {
  await getReferralCode(req, res);
});

export default router;
