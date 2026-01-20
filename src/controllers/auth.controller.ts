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

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    return res.status(201).json({
        message: "User registered successfully",
        accessToken,
        refreshToken,
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

    return res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
    });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new AppError(401, "Refresh token required");
    }

    const decoded = verifyRefreshToken(refreshToken) as { id: number };

    const accessToken = generateAccessToken({ id: decoded.id });

    return res.json({ accessToken });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    return res.json({ message: "Logged out successfully" });
});
