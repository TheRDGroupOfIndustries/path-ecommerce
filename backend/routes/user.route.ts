import { Router, Request, Response } from "express";
import * as userController from "../controller/user.controller.js";

const route = Router();

route.get("/get-all", async (req: Request, res: Response) => {
	await userController.allUsers(req, res);
});

route.get("/get-by-id/:id", async (req: Request, res: Response) => {
    await userController.userById(req, res)
})

route.post("/create-user", async (req: Request, res: Response) => {
    await userController.createUser(req, res)
})

route.put("/update-user/:id", async (req: Request, res: Response) => {
    await userController.updateUser(req, res)
})

route.delete("/delete-user/:id", async (req: Request, res: Response) => {
    await userController.deleteUser(req, res)
})
route.post("/login",async(req:Request,res:Response)=>{
    await userController.login(req,res)
})
export default route;


