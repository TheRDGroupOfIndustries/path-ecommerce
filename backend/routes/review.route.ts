// routes/review.routes.ts
import express from "express";
import { createReview, getAllReviews, getReviewsByProductId  ,getReviewsByMarketplaceId, getReviewsByPropertyId,} 
from "../controller/review.controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
    await createReview(req,res);
});

router.get("/get", async (req, res) => {
   await getAllReviews(req,res);

});

router.get("/product/:productId", async (req, res) => {
    await getReviewsByProductId(req,res);
});

router.get("/marketplace/:marketplaceId", async (req, res) => {
    await getReviewsByMarketplaceId(req,res);
});

router.get("/property/:propertyId", async (req, res) => {
    await getReviewsByPropertyId(req,res);
});

export default router;


