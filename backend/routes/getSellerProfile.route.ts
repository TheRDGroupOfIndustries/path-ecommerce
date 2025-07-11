import { Router } from "express";
import { getSellerDashboardDetails } from "../controller/getSellerProfile.contoller.js";
import { getSellerEnquiries } from "../controller/getSellerProfile.contoller.js";

const router = Router();

router.get("/:id", async (req,res)=>{
    await getSellerDashboardDetails(req,res);
});

router.get("/seller-enquiry/:id",async (req,res)=>{
     await getSellerEnquiries(req,res);
});


export default router;

