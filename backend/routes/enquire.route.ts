import { Router } from "express";
import { createEnquiry , getAllEnquiries , deleteEnquiry,getAllEnquiriesByRole } from "../controller/enquire.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUserEnquiries } from "../controller/getUserEnquiry.controller.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/get-all", getAllEnquiries);
router.get("/by-role",isAuthenticated, getAllEnquiriesByRole);
router.delete("/delete/:id", deleteEnquiry);

router.get("/user-enquiry", isAuthenticated, getUserEnquiries);


export default router;
