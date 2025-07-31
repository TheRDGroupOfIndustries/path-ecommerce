import { Router, Request, Response } from "express";
import * as userController from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import passport from "../utils/passport.js";
import { generateTokens, verifyTokenFromHeader } from "../utils/jwt.js";
import * as userModel from "../model/user.model.js";
import { searchUsersByName } from "../controller/user.controller.js";
const route = Router();

// Get all users
route.get("/get-all", async (req: Request, res: Response) => {
  await userController.allUsers(req, res);
});

// Get user by ID
route.get("/get-by-id/:id", async (req: Request, res: Response) => {
  await userController.userById(req, res);
});

route.get(
  "/get-orders",
  isAuthenticated,
  async (req: Request, res: Response) => {
    await userController.getOrders(req, res);
  }
);

//  Create a new user
route.post(
  "/create-user",
  upload.single("image"),
  async (req: Request, res: Response) => {
    await userController.createUserController(req, res);
  }
);
route.put(
  "/update-auth-user",
  isAuthenticated,
  async (req: Request, res: Response) => {
    await userController.updateUser(req, res);
  }
);

route.get("/get-by-email/:email", async (req: Request, res: Response) => {
  await userController.userByEmail(req, res);
});

route.put("/update-password/:email", async (req: Request, res: Response) => {
  await userController.updatePassword(req, res);
});

//  Update user
route.put(
  "/update-user/:id",
  upload.single("image"),
  async (req: Request, res: Response) => {
    await userController.updateUser(req, res);
  }
);

//  Delete user
route.delete("/delete-user/:id", async (req: Request, res: Response) => {
  await userController.deleteUser(req, res);
});

// User login
route.post("/login", async (req: Request, res: Response) => {
  await userController.login(req, res);
});

// Get current authenticated user
route.get("/me", isAuthenticated, async (req: Request, res: Response) => {
  await userController.getMe(req, res);
});

//  Promote user to associate
route.patch(
  "/promote-to-associate/:id",
  async (req: Request, res: Response) => {
    await userController.promoteToAssociate(req, res);
  }
);

//  Get all associates (used in referral dropdown)
route.get("/all-associates", async (req: Request, res: Response) => {
  await userController.getAllAssociates(req, res);
});

// Trigger Google Login

route.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handle Callback from Google
route.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req: any, res: Response) => {
    console.log("Google callback query:", req.query);
    const user = req.user;
    const token = generateTokens(user);
    // console.log("JWT Token:", token.accessToken);

    // Redirect with token to frontend (or set cookie)
    res.redirect(
      `spc://auth-callback?token=${token.accessToken}`
      // `${process.env.REDIRECT_URL}/google-success?token=${token.accessToken}`
    );
  }
);

route.get("/signup-referral", async (req: Request, res: Response) => {
  await userController.getUsersWithReferralDetails (req, res);
});


// search
route.get("/search", searchUsersByName);



export default route;
