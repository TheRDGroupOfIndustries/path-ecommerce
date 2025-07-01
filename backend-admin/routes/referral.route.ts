import { Router } from "express";
import { createOrUpdateReferral } from "../controller/referral.controller.js";

const router = Router();

router.post("/create-or-update", createOrUpdateReferral);

export default router;
