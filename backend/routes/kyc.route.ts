import { Router } from "express";
import {
  createKyc,
  getAllKyc,
  getKycBySeller,
  approveKyc,
  rejectKyc,
  deleteKyc
} from "../controller/kyc.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/roleee.js";
import { upload } from "../middlewares/multer.js";

const router = Router();


const fileFields = [
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "passport", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
  { name: "image", maxCount: 1 },
];

//  Route to create KYC with file uploads
router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
  ]),
 // @ts-ignore
  createKyc
);


// Seller's own KYC
router.get("/my-kyc", isAuthenticated, async (req, res) => {
  await getKycBySeller(req, res);
});

// Admin: View all KYC
router.get("/all", isAuthenticated, authorizeRole("ADMIN"), async (req, res) => {
  await getAllKyc(req, res);
});

//  Admin: Approve KYC
router.patch("/approve/:id", isAuthenticated, authorizeRole("ADMIN"), async (req, res) => {
  await approveKyc(req, res);
});

router.patch("/reject/:id", isAuthenticated, authorizeRole("ADMIN"), async (req, res) => {
  await rejectKyc(req, res);
});

router.delete("/delete/:id", isAuthenticated, authorizeRole("ADMIN"), deleteKyc);

export default router;


