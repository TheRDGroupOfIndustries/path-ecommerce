import { Router } from "express";
import { getSellerDashboardDetails } from "../controller/getSellerProfile.contoller.js";

const router = Router();

router.get("/:id", async (req,res)=>{
    await getSellerDashboardDetails(req,res);
});

export default router;

