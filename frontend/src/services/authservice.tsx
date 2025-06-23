import type { AuthResponse, LoginCredentials } from "../types/auth"

const API_BASE_URL="http://localhost:8000/api/user"

export const authservices={
    async login(credentials:LoginCredentials):Promise<AuthResponse>{
        const res=await fetch(`${API_BASE_URL}/`)
    }}