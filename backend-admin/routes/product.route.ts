import * as productController from "../controller/product.controller.js";
import { Router } from "express";
import { updateReferralInProducts } from "../controller/product.controller.js";

const router = Router();

router.get("/get-all", async (req, res) => {
  await productController.getAllProducts(req, res);
});

router.get("/get-by-id/:id", async (req, res) => {
  await productController.getById(req, res);
});

router.get("/get-by-category/:id", async (req, res) => {
  await productController.getByCategory(req, res);
});

router.delete("/delete-product/:id", async (req, res) => {
  await productController.deleteProduct(req, res);
});

router.post("/create-product", async (req, res) => {
  await productController.createData(req, res);
});

router.put("/update-product/:id", async (req, res) => {
  await productController.updateData(req, res);
});

router.post("/update-referral",updateReferralInProducts);

router.get("/get-trendy", productController.getTrendyProducts);

export default router