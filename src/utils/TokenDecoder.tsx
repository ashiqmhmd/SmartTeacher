import { jwtDecode, JwtPayload } from "jwt-decode";

export const tokenDecode = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
        
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export const getUserId = async (token: string) => {
    const decoded = tokenDecode(token);
    
    if (decoded && typeof decoded === "object" && "id" in decoded) {
        return decoded.id;
    } else {
        return null; 
    }
};

