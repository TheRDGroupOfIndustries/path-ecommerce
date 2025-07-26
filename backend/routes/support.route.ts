import express from "express";
import { postSupportMessage, getSupportMessagesBySeller,deleteSupportMessage,getAllSupportMessages, getSupportMessagesForUser, updateReply } from "../controller/support.controller.js";

const router = express.Router();

router.get("/admin", getAllSupportMessages);
router.post("/create", postSupportMessage);
router.get("/:sellerId", getSupportMessagesBySeller);
router.delete("/delete/:id", deleteSupportMessage);
router.put("/update/:id", updateReply)
router.get("/user/:userId", getSupportMessagesForUser)

export default router;
