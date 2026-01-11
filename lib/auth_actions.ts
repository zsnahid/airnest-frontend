"use server";
import axios from "axios";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface AuthResponse {
  access_token: string;
}

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

interface User {
  name: string;
  role: string;
}

interface AuthState {
  success: boolean;
  message: string;
}

async function saveJwtInCookie(data: AuthResponse): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "access_token",
    value: data.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    path: "/",
  });
}

export async function registerUser(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log("Creating user:", userData);
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/signup",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    console.log(data);
    await saveJwtInCookie(data);
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
}

export async function signinUser(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(userData);
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/login",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    await saveJwtInCookie(data);
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Login failed" };
  }
}

export async function getUserFromToken(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return {
      name: payload.username,
      role: payload.role,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}
