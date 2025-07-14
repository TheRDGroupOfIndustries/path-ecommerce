import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

// Get all products
router.get("/get-all", async (req, res) => {
  try {
    await productController.getAllProducts(req, res);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get product by ID
router.get("/get-by-id/:id", async (req, res) => {
  try {
    await productController.getById(req, res);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/search/:value", async (req, res) => {
  try {
    await productController.getSearchResults(req, res);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get products by category
router.get("/get-by-category/:id", async (req, res) => {
  try {
    await productController.getByCategory(req, res);
  } catch (error) {
    console.error("Error in getByCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete product
router.delete("/delete-product/:id", async (req, res) => {
  try {
    await productController.deleteProduct(req, res);
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create product
router.post("/create-product", isAuthenticated, async (req, res) => {
  try {
    await productController.createData(req, res);
  } catch (error) {
    console.error("Error in createData:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update product
router.put("/update-product/:id", async (req, res) => {
  try {
    await productController.updateData(req, res);
  } catch (error) {
    console.error("Error in updateData:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get trendy products
router.get("/get-trendy", async (req, res) => {
  try {
    await productController.getTrendyProducts(req, res);
  } catch (error) {
    console.error("Error in getTrendyProducts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
