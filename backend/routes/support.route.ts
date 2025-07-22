import express from "express";
import { postSupportMessage, getSupportMessagesBySeller,deleteSupportMessage } from "../controller/support.controller.js";

const router = express.Router();

router.post("/create", postSupportMessage);
router.get("/:sellerId", getSupportMessagesBySeller);
router.delete("/delete/:id", deleteSupportMessage);

export default router;
