import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoute from "./routes/user.route.js";
import marketPlace from "./routes/marketplace.route.js";
import propertyRoute from "./routes/property.route.js";
import productRoute from "./routes/product.route.js";
import referralRoute from "./routes/referral.route.js";
import enquiryRoute from "./routes/enquire.route.js";
import sellerRoute from "./routes/getSellerProfile.route.js";
import kycRoute from "./routes/kyc.route.js";
import announcementRoute from "./routes/announcement.route.js";
import associateRoute from "./routes/getAssociateProfile.route.js";
import mangageAssociate from "./routes/associate.route.js";
import reviewRoute from "./routes/review.route.js";
import verify from "./routes/sendotp.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import supportRoute from "./routes/support.route.js";
import levelRoute from "./routes/commision.route.js";
import treeRoute from "./routes/tree.route.js";

//chetan added
import session from "express-session";
import passport from "./utils/passport.js";

const app = express();
const PORT = 8000;

// Configure CORS for development
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://path-ecommerce.vercel.app",
  "https://path-ecommerce-pwtg.vercel.app",
  "https://admin.sripadchhaya.com",
  "https://admin.sripadchhaya.in",
  "https://sripadchhaya.com",
  "https://sripadchhaya.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Added PATCH here
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "25mb" })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

//chetan added
app.use(passport.initialize());
app.use(passport.session());
// Test route
app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// API Routes
app.use("/api/users", userRoute);
app.use("/api/marketplace", marketPlace);
app.use("/api/property", propertyRoute);
app.use("/api/product", productRoute);
app.use("/api/referral", referralRoute);
app.use("/api/enquiry", enquiryRoute);
app.use("/api/seller", sellerRoute); //profile
app.use("/api/kyc", kycRoute);
app.use("/api/announcement", announcementRoute);
app.use("/api/associate", associateRoute); //profile
app.use("/api/review", reviewRoute);
app.use("/api/verification", verify);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/manage-associate", mangageAssociate);
app.use("/api/support", supportRoute);
app.use("/api/level", levelRoute);
app.use("/api/tree", treeRoute);

import type { Request, Response, NextFunction } from "express";

app.use(
  (
    err: { message: string },
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.message === "Not allowed by CORS") {
      res.status(403).json({ error: "CORS policy blocked this request" });
    } else {
      next(err);
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
