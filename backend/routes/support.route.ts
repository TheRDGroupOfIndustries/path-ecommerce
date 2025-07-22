import express from "express";
import { postSupportMessage, getSupportMessagesBySeller } from "../controller/support.controller.js";

const router = express.Router();

router.post("/create", postSupportMessage);
router.get("/:sellerId", getSupportMessagesBySeller);

export default router;
