import { Request, Response } from "express";
import * as userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyTokenFromHeader } from "../utils/jwt.js";
import * as associateModel from "../model/associate.model.js";
import { Role } from "@prisma/client";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import db from "../client/connect.js"; 

export const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.allUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
};

export const userByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  // console.log(email)
  try {
    const user = await userModel.userByGmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, phone, role, address, referralCode } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await userModel.userByGmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    let imageUrl: string | undefined = undefined;

    if (req.file) {
      imageUrl = await uploadBufferToCloudinary(req.file.buffer, email, "profiles");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let usedReferral = null;

    //  Handle Referral Code
    if (referralCode) {
      usedReferral = await db.referral.findUnique({
        where: { referral: referralCode },
        include: {
          createdFor: {
            include: {
              associate: true,
            },
          },
        },
      });

      if (!usedReferral) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
// update usedBy array
      await db.referral.update({
        where: { id: usedReferral.id },
        data: {
          usedBy: {
            push: email,
          },
        },
      });
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role?.toUpperCase() || "USER",
        imageUrl,
        address,
        usedReferralId: usedReferral?.id, //  Save referral ID if valid
      },
    });

    if (user) {
      const token = generateTokens(user);
      return res.status(201).json({
        message: "Signup successful",
        token,
        user,
        referralUsed: usedReferral?.referral,
        associate: usedReferral?.createdFor?.name,
        associateLevel: usedReferral?.createdFor?.associate?.level ?? null,
        associatePercent: usedReferral?.createdFor?.associate?.percent ?? null,
      });
    } else {
      return res.status(500).json({ error: "User creation failed" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  const { email } = req.params;
  const {password} = req.body;

  try {
      const newPass = await bcrypt.hash(password, 10);
    await userModel.updatePassword(email, newPass);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//update user
export const updateUser = async (req: Request, res: Response) => {

let id: string | undefined = req.params.id;
// Only override if updating the authenticated user
if (!id && req.headers.authorization) {
  const data = verifyTokenFromHeader(req.headers.authorization as string);
  id = data?.id;
}

if (!id) {
  return res.status(400).json({ error: "No user ID found" });
}

  if (!id) {
    return res.status(400).json({ error: "No user ID found" });
  }
  try {
    const body = { ...req.body };

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    if (req.file) {
      const imageUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        `profile-${id}`,
        "profiles"
      );
      body.imageUrl = imageUrl;
    }

    if (body.email) {
      const existingUserWithEmail = await userModel.userByGmail(body.email);
      if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        return res.status(409).json({ error: "Email already in use by another user" });
      }
    }

    await userModel.updateUser(id, body);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await userModel.deleteUser(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(" Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await userModel.userByGmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const  token  = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userSafe } = user;

    return res.status(200).json({ user: userSafe, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const promoteToAssociate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { level, percent } = req.body;

  if (!level || !percent) {
    return res.status(400).json({ message: "Level and percent are required" });
  }

  try {
    const user = await userModel.userById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userModel.updateUser(id, { role: "ASSOCIATE" });

    const existing = await associateModel.getAssociateByUserId(id);
    if (existing) {
      await associateModel.updateAssociate(id, parseInt(level), parseInt(percent));
    } else {
      await associateModel.createAssociate(id, parseInt(level), parseInt(percent));
    }

    res.status(200).json({ message: "User promoted to Associate and data saved." });
  } catch (error) {
    console.error("Error promoting user to associate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllAssociates = async (req: Request, res: Response) => {
  try {
    const associates = await userModel.getUsersByRole(Role.ASSOCIATE);
    if (!associates || associates.length === 0) {
      return res.status(404).json({ message: "No associates found" });
    }
    return res.status(200).json({ associates });
  } catch (error) {
    console.error("Error fetching associates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const user = await userModel.userById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userSafe } = user;
    return res.status(200).json({ user: userSafe });
  } catch (error) {
    console.error("Error in getMe:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id plz?" });
    }

    const user = await userModel.getOrders(userId);
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getUsersWithReferralDetails = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      include: {
        usedReferral: {
          include: {
            createdFor: {
              include: {
                associate: true
              }
            }
          }
        }
      }
    });

    const enrichedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      usedReferralCode: user.usedReferral?.referral ?? null,
      usedReferralOwner: user.usedReferral?.createdFor?.name ?? null,
      associateLevel: user.usedReferral?.createdFor?.associate?.level ?? null,
      associatePercent: user.usedReferral?.createdFor?.associate?.percent ?? null,
    }));

    return res.status(200).json({ users: enrichedUsers });
  } catch (error) {
    console.error("Error fetching users with referral details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// search
export const searchUsersByName = async (req: Request, res: Response) => {
  const { q } = req.query;

  try {
    const users = await db.user.findMany({
      where: {
        name: {
          contains: q as string,
          mode: "insensitive",
        },
      },
    });

    return res.json({ users });
  } catch (err) {
    console.error("Search failed", err);
    return res.status(500).json({ msg: "Search failed", error: err });
  }
};







// export const createUser = async (req: Request, res: Response) => {
//   const { name, email, password, confirmPassword, phone, role ,address} = req.body;

//   if (password !== confirmPassword) {
//     return res.status(400).json({ error: "Passwords do not match" });
//   }

//   try {
//     const existingUser = await userModel.userByGmail(email);
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     let imageUrl: string | undefined = undefined;

//     if (req.file) {
//       imageUrl = await uploadBufferToCloudinary(req.file.buffer, email, "profiles");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await userModel.createUser({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       role: role?.toUpperCase() || "USER",
//       imageUrl,
//       address
//     });

//     if (user) {
//       const token = generateTokens(user);
//       return res.status(201).json({ message: "success", token, user });
//     } else {
//       return res.status(500).json({ error: "User creation failed" });
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

