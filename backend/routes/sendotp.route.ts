import express from "express";
import { Request, Response } from "express";
import { sendOtpMail } from "../utils/nodemailer.js";

const router = express.Router();


router.post("/send-otp", async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP are required" });
    return;
  }

  try {
    const result = await sendOtpMail(email, otp);

    if (result) {
      res.status(200).json({ success: "OTP sent successfully!" });
    } else {
      res.status(401).json({ error: "Failed to send OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
