import { Router } from "express";
import { getAssociateDashboardDetails } from "../controller/getAssociateDashboardDetai";

const router = Router();

router.get("/:id", async (req, res) => {
  await getAssociateDashboardDetails(req, res);
});

export default router;
