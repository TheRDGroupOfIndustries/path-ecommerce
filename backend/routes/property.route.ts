import * as propertyController from "../controller/property.controller.js";
import { Router } from "express";

const route = Router();

route.get("/get-all", async (req, res) => {
  await propertyController.allProperty(req, res);
});

route.get("/get-by-category/:category", async (req, res) => {
  await propertyController.propertyByCat(req, res);
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

export default route;
