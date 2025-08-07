import { Router } from "express";
import { getHighLevelAssociates,updateCommissionPercent,deleteAssociateById ,searchAssociates,updateLevelPercent} 
from "../controller/tree.controller.js";

const router = Router();

router.get("/", getHighLevelAssociates);

router.patch("/edit", updateCommissionPercent);

router.delete("/delete/:id", deleteAssociateById);

router.get("/search-associate", searchAssociates);


router.patch("/lowerlevel", updateLevelPercent);

export default router;

