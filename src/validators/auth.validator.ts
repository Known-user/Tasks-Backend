export const validateAuthInput = (email?: string, password?: string) => {
    if (!email || !password) {
        throw new Error("Email and password required");
    }
};
