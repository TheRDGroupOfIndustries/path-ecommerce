import * as marketPlaceController from "../controller/marketplace.controller.js";
import { Router } from "express";

const route = Router();

route.get("/get-all", async (req, res) => {
  await marketPlaceController.allMarketplaces(req, res);
});

route.get("/get-by-category/:category", async (req, res) => {
  await marketPlaceController.marketplaceByCat(req, res);
});

route.get("/get-by-id/:id", async (req, res) => {
  await marketPlaceController.marketplaceById(req, res);
});

route.get("/search/:value", async (req, res) => {
  try {
    await marketPlaceController.getSearchResults(req, res);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


route.get("/get-by-user/:userId", async (req, res) => {
  await marketPlaceController.marketplaceByUser(req, res);
});
route.post("/create", async (req, res) => {
  await marketPlaceController.createMarketplace(req, res);
});

route.put("/update/:id", async (req, res) => {
  await marketPlaceController.updateMarketplace(req, res);
});

route.delete("/delete/:id", async (req, res) => {
  await marketPlaceController.deleteMarketplace(req, res);
});

export default route;
