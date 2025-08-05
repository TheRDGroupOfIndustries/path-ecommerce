import { Router } from "express";
import { getHighLevelAssociates,updateTopLevelCommissionPercent,deleteAssociateById ,searchAssociates} from "../controller/tree.controller.js";

const router = Router();

router.get("/", getHighLevelAssociates);

router.patch("/edit", updateTopLevelCommissionPercent);

router.delete("/delete", deleteAssociateById);

router.get("/search-associate", searchAssociates);


export default router;

