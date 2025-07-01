import { Router } from "express";
import { createEnquiry } from "../controller/enquire.controller.js";

const router = Router();

router.post("/enquiries", createEnquiry);

export default router;
