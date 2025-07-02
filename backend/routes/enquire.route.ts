import { Router } from "express";
import { createEnquiry , getAllEnquiries , deleteEnquiry } from "../controller/enquire.controller.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/get-all", getAllEnquiries);
router.delete("/delete/:id", deleteEnquiry);

export default router;
