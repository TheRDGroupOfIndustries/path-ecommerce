import { Router } from "express";
import { getHighLevelAssociates } from "../controller/tree.controller.js";

const router = Router();

router.get("/", getHighLevelAssociates);

export default router;
