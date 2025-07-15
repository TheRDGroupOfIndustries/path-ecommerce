import express from "express";
import { buyNow ,getOrderById} from "../controller/order.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/buynow", isAuthenticated,async (req, res) => {
   await buyNow(req, res);
});

router.get("/:orderId", isAuthenticated,  async (req, res) => {
    await getOrderById(req, res);
});

export default router;
