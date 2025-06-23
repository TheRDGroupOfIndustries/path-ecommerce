import { Request, Response } from "express";
import * as userModel from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { generateTokens } from "../utils/jwt.js";

export const allUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.allUsers();
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found"});
        }
        else if (users.length > 0) {
            return res.status(200).json({ users });
        }
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const userById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await userModel.userById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    // const body = req.body;
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = userModel.findUnique({ where: { email } }) as unknown as { id: string, email: string } | null;
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await userModel.createUser({email: email, name: name, password: hashedPassword});
        if (user) {
                const token = generateTokens(user);
                return res.status(201).json({ "message": "success", "token": token });
        }

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const user = await userModel.updateUser(id, body);
        return res.status(200).json({ "message": "success" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await userModel.deleteUser(id);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const login=async(req:Request,res:Response)=> {
    const {email,password}=req.body;

    try{
        const user = await userModel.userByGmail(email);
        if(!user){
            return res.status(401).json({message:"invaild email or password"})
        }
        const ismatched = await bcrypt.compare(password, user.password);
        if (!ismatched) {
            return res.status(401).json({ error: 'Invalid password' });
        }
    
        const token = generateTokens(user);
        const {password:_,...usersafe}=user
        return res.status(200).json({ user:usersafe, token});
    }
    catch(err){
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
