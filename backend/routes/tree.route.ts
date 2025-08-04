import { Router } from "express";
import { getHighLevelAssociates,updateTopLevelCommissionPercent } from "../controller/tree.controller.js";

const router = Router();

router.get("/", getHighLevelAssociates);

router.patch("/edit", updateTopLevelCommissionPercent);

export default router;

