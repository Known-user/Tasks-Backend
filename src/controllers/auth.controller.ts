import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError(400, "Email and password required");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(400, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return res.status(201).json({
        message: "User registered successfully",
    });

});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError(400, "Email and password required");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return res.json({
        message: "Login successful",
        accessToken,
    });

});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "Refresh token missing");
    }

    const decoded = verifyRefreshToken(refreshToken) as { id: number };

    const accessToken = generateAccessToken({ id: decoded.id });

    return res.json({ accessToken });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
        path: "/auth/refresh",
    });

    return res.status(200).json({ message: "Logged out successfully" });

});
