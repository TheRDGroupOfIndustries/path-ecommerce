import express from "express";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controller/announcement.controller.js";

const router = express.Router();

router.get("/get", async (req,res)=>{
    await getAllAnnouncements(req,res);
});

router.post("/create",  async (req,res)=>{ 
   await createAnnouncement(req,res);
});

router.patch("/update/:id",  async (req,res)=>{ 
   await updateAnnouncement(req,res);
});

router.delete("/delete/:id",async (req,res)=>{ 
    await deleteAnnouncement(req,res);
});

export default router;


