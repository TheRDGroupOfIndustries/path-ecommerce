// import type { AuthResponse, LoginCredentials } from "../types/auth"

// const API_BASE_URL=`${API_URL}/api/users`

// export const authservices={
//     async login(credentials:LoginCredentials):Promise<AuthResponse>{
//         const res=await fetch(`${API_BASE_URL}/`)
//     }}

// src/services/authservices.ts
import { API_URL } from "@/lib/api.env";
import axios from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: {
    accessToken: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const API_BASE_URL = `${API_URL}/api/users`;

export const authservices = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(
        `${API_BASE_URL}/login`,
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(
        `${API_BASE_URL}/create-user`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    //   console.log("register: ",res);
      
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  },

  async me(token: string): Promise<AuthResponse> {
    try {
      const res = await axios.get<AuthResponse>(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Session expired"
      );
    }
  },
};
