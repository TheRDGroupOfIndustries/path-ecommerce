import db from "../client/connect.js";
import { CreateUserInput, UpdateUserInput } from "../client/types/user.types.js";
import { Role } from "@prisma/client";

// Get all users
export const allUsers = async () => db.user.findMany({});

// Get user by ID
export const userById = async (id: string) => db.user.findUnique({ where: { id } });

// Get user by email
export const userByGmail = async (email: string) => db.user.findUnique({ where: { email } });

// Get users by role (e.g. ASSOCIATE)
export const getUsersByRole = async (role: Role) => {
  return await db.user.findMany({
    where: { role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      associate: { //added this for view association
        select: {
          level: true,
          percent: true,
        },
      },
    },
  });
};


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
      role: true, // Add this
    },
  });
};


// Update user
export const updateUser = async (id: string, data: UpdateUserInput) => {
  return await db.user.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.password && { password: data.password }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address && { address: data.address }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.role && { role: data.role }),
      ...(data.createdById && { createdById: data.createdById }),
    },
  });
};

// Delete user
export const deleteUser = async (id: string) => {
  await db.user.delete({ where: { id } });
};
