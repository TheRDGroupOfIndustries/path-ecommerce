// routes/review.routes.ts
import express from "express";
import { createReview, getAllReviews, getReviewsByProductId } from "../controller/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/product/:productId", getReviewsByProductId);

export default router;
