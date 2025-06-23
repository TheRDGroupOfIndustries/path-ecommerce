import db from "../client/connect.js";
import { CreateUserInput, UpdateUserInput } from "../client/types/user.types";

export const allUsers = async () => db.user.findMany({});

export const userById = async (id: string) =>
  db.user.findUnique({ where: { id } });

export const userByGmail = async (email: string) =>
  db.user.findUnique({ where: { email } });


export const createUser = async (data: CreateUserInput) => {
    const create = await db.user.create({
        data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "USER",
        phone: data.phone || null,
        address: data.address || null,
        imageUrl: data.imageUrl || null
        },
        select: {
          id: true,
          email: true
        }
    });
    if (create) return create
}

export const updateUser = async (id: string, data: UpdateUserInput) => {
  await db.user.update({
    where: { id: id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      phone: data.phone || null,
      address: data.address || null,
      imageUrl: data.imageUrl || null,
      createdById: data.createdById || null,
    },
  });
};


export const deleteUser = async (id: string) => {
    await db.user.delete({
        where: { id: id}
    })
}

export function findUnique(arg0: {}) {
    throw new Error("Function not implemented.");
}
