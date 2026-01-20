import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { isJwtPayload, JwtPayload } from "../types/jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (!isJwtPayload(decoded)) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
