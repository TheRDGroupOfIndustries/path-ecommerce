import express from "express";
import { addToCart, getCartItems,updateCartItemQuantity,deleteCartItem } from "../controller/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticated, async (req, res) => {
  await addToCart(req, res);
});

router.get("/", isAuthenticated, getCartItems);

router.put("/update-quantity", isAuthenticated, async (req, res) => {
  await updateCartItemQuantity(req, res);
});

router.delete("/delete-cart/:cartItemId", isAuthenticated, deleteCartItem);

export default router;
