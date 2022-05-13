import jwt from "jsonwebtoken";
import { ExtendedError } from "socket.io/dist/namespace";
import { Role } from "../util";
import { User } from "../models";
import { CustomSocket } from "./socket.interface";
import { DecodedData, UserModel } from "../interface";

export const protectSocket = async (socket: CustomSocket, next: (err?: ExtendedError) => void) => {
    const authorization = socket.request.headers.authorization;
    let token;

    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            const decoded = <DecodedData>jwt.verify(token, `${process.env.JWT_SECRET}`);

            let user: UserModel | null = null;
            if (decoded.role.includes(Role.ADMIN)) {
                socket.userRole = decoded.role;
                return next();
            } else
                user = await User.findById(`${decoded.id}`).select("isBlocked role _id");

            if (!user)
                next(new Error("User not found"));
            
            else if ((user as UserModel).isBlocked)
                next(new Error("Account has been blocked"));
            
            else {
                socket.user = (user._id as string).toString();
                socket.userRole = user.role;
                return next();
            }
        } catch (error) {
            next(new Error("Not authorized, token failed"));
        }
    }

    if (!token)
        next(new Error("Not authorized, no token"));
};
