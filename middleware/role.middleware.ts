import { Response, NextFunction } from "express";
import { CustomRequest, UserModel } from "../interface";
import { HttpException } from "../exceptions";
import { Role } from "../util";

export const checkRoles =
    (roles: Role[]) =>
    async (req: CustomRequest, _res: Response, next: NextFunction) => {
        const user = <UserModel>req.headers["user"];

        let isAuthericed: boolean = roles.some((role) => user.role.includes(role));

        if (!isAuthericed)
            next(new HttpException(401, "Not an authorized token"));
        
        next();
    };
