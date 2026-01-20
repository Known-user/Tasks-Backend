export interface JwtPayload {
    id: number;
}

export const isJwtPayload = (payload: unknown): payload is JwtPayload => {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "id" in payload &&
        typeof (payload as any).id === "number"
    );
};
