import { Request, Response } from "express";
import * as userModel from "../model/user.model.js";

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
    const body = req.body;
    try {
        const user = await userModel.createUser(body);
        return res.status(201).json({ "message": "success" });

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
