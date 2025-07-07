import { Router, Request, Response } from "express";
import * as userController from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const route = Router();

// Get all users
route.get("/get-all", async (req: Request, res: Response) => {
  await userController.allUsers(req, res);
});

// Get user by ID
route.get("/get-by-id/:id", async (req: Request, res: Response) => {
  await userController.userById(req, res);
});

//  Create a new user
route.post("/create-user", async (req: Request, res: Response) => {
  await userController.createUser(req, res);
});

//  Update user
route.put("/update-user/:id", async (req: Request, res: Response) => {
  await userController.updateUser(req, res);
});

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
route.patch("/promote-to-associate/:id", async (req: Request, res: Response) => {
  await userController.promoteToAssociate(req, res);
});

//  Get all associates (used in referral dropdown)
route.get("/all-associates", async (req: Request, res: Response) => {
  await userController.getAllAssociates(req, res);
});

export default route;
