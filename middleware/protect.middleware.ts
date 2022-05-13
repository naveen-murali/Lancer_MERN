import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { BadRequestException, HttpException } from "../exceptions";
import { CustomRequest } from "../interface";
import { DecodedData, UserModel, AdminModel } from "../interface";
import { Admin, User } from "../models";
import { Role } from "../util";

export const protect = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = <DecodedData>(
                jwt.verify(token, `${process.env.JWT_SECRET}`)
            );

            let user: UserModel | AdminModel | null;
            if (decoded.role.includes(Role.ADMIN))
                user = await Admin.findById(`${decoded.id}`).select("-password");
            else
                user = await User.findById(`${decoded.id}`).select("-password");

            if (!user)
                next(new BadRequestException("User not found"));
            
            else if (
                !user.role.includes(Role.ADMIN) &&
                (user as UserModel).isBlocked
            )
                next(new HttpException(403, "Account has been blocked"));
            
            else {
                user.password = undefined;
                req.headers["user"] = user;
                next();
            }
        } catch (error) {
            console.error(error);
            next(new HttpException(401, "Not authorized, token failed"));
        }
    }

    if (!token)
        next(new HttpException(401, "Not authorized, no token"));
};
