import express from "express";
import { addToCart, getCartItems } from "../controller/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticated, async (req, res) => {
  await addToCart(req, res);
});

router.get("/", isAuthenticated, getCartItems);

export default router;
