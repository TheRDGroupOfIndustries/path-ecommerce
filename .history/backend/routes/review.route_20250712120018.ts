// routes/review.routes.ts
import express from "express";
import { createReview, getAllReviews, getReviewsByProductId } from "../controller/review.controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
    await createReview(req,res);
});

router.get("/", async (req, res) => {
   await getAllReviews(req,res);

});

router.get("/product/:productId", getReviewsByProductId);

export default router;

router.post("/check", async (req, res) => {
   await checkReferralCode(req, res);
});
