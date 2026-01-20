import { AuthRequest } from "../middlewares/auth.middleware";

export const requireUser = (req: AuthRequest) => {
    if (!req.user) {
        throw new Error("User not authenticated");
    }
    return req.user;
};
