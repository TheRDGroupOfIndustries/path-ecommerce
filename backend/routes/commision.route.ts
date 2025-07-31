import express from "express";
import { saveOrUpdateCommissionLevels,getCommissionLevels } from "../controller/commisionLevel.controller.js";

const router = express.Router();

router.patch("/save", saveOrUpdateCommissionLevels); 

router.get("/", getCommissionLevels);

export default router;
