import { Router } from "express";
import { createEnquiry , getAllEnquiries , deleteEnquiry,getAllEnquiriesByRole } from "../controller/enquire.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/get-all", getAllEnquiries);
router.get("/by-role",isAuthenticated, getAllEnquiriesByRole);
router.delete("/delete/:id", deleteEnquiry);

export default router;
