import * as propertyController from "../controller/property.controller.js";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const route = Router();

route.get("/get-all", async (req, res) => {
  await propertyController.allProperty(req, res);
});

route.get("/get-by-category/:category", async (req, res) => {
  await propertyController.propertyByCat(req, res);
});


route.get("/search/:value", async (req, res) => {
  try {
    await propertyController.getSearchResults(req, res);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


route.get("/get-by-id/:id", async (req, res) => {
  await propertyController.propertiesById(req, res);
});

route.get("/get-by-user/:userId", async (req, res) => {
  await propertyController.propertyByUser(req, res);
});
route.post("/create", async (req, res) => {
  await propertyController.createProperty(req, res);
});

route.put("/update/:id", async (req, res) => {
  await propertyController.updateProperty(req, res);
});

route.delete("/delete/:id", async (req, res) => {
  await propertyController.deleteProperty(req, res);
});


route.get("/by-role", isAuthenticated, async (req, res) => {
  try {
    await propertyController.propertyDataByUserRole(req, res);
  } catch (error) {
    console.error("Error in get-role-based:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default route;
