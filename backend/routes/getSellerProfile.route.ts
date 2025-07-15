import { Router } from "express";
import { getSellerDashboardDetails } from "../controller/getSellerProfile.contoller.js";
import { getSellerEnquiries } from "../controller/getSellerProfile.contoller.js";
import { getSellerOrders } from "../controller/getSellerProfile.contoller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();


router.get("/seller-orders", isAuthenticated, async (req, res) => {
  await getSellerOrders(req, res);
});


router.get("/seller-enquiry/:id",async (req,res)=>{
     await getSellerEnquiries(req,res);
});

router.get("/get-seller/:id", async (req,res)=>{
    await getSellerDashboardDetails(req,res);
});

export default router;

