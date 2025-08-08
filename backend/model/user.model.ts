import db from "../client/connect.js";
import {
  CreateUserInput,
  UpdateUserInput,
} from "../client/types/user.types.js";
import { Role } from "@prisma/client";

// Get all users
export const allUsers = async () => db.user.findMany({});

// Get user by ID
export const userById = async (id: string) =>
  db.user.findUnique({ where: { id } });

// Get user by email
export const userByGmail = async (email: string) =>
  db.user.findUnique({ where: { email } });

// Get users by role 
export const getUsersByRole = async (role: Role) => {
  return await db.user.findMany({
    where: { role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      associate: {
        select: {
          level: true,
          percent: true,
          newLevelAssociate: true, 
        },
      },
    },
  });
};

export const getOrders = async (id: string) =>
  db.user.findMany({ where: { id }, include: {
    orders: {
      include: {
        product: true
      }
    },
  } });

// Create a new user
export const createUser = async (data: CreateUserInput) => {
  return await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "USER",
      phone: data.phone || null,
      address: data.address || null,
      imageUrl: data.imageUrl || null,
    },
    select: {
      id: true,
      email: true,
      role: true, 
    },
  });
};

// Update user
export const updateUser = async (id: string, data: UpdateUserInput) => {
  return await db.user.update({
    where: { id },
     data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.createdById !== undefined ? { createdById: data.createdById } : {}),
    },
  });
};

export const updatePassword = async (email: string, password: string) => {
  return await db.user.update({
    where: { email: email },
    data: {
      password: password,
    },
  });
};

// Delete user
export const deleteUser = async (id: string) => {
  await db.user.delete({ where: { id } });
};
