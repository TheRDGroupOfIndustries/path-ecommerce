import { Router } from "express";

import {
    updateAssociateController,
    deleteAssociateController,
} from "../controller/associate.controller.js";


const router = Router()

router.get("/", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }
        const associate = await getAssociateByUserId(id as string);
        if (!associate) {
            return res.status(404).json({ message: "Associate not found" });
        }
        return res.status(200).json(associate);
    } catch (error) {
        console.error("Error fetching associate:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


router.put("/update/:id", async (req, res) => {
    return updateAssociateController(req, res)
});

router.delete("/delete/:id", async (req, res) => {
    return deleteAssociateController(req, res)
});


export default router;