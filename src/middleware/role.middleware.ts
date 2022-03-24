import { Response, NextFunction } from "express";
import { CustomRequest } from "../interface";
import { HttpException } from '../exceptions';
import { Role } from '../util';

export const checkRoles = (roles: Role[]) =>
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.headers['user'];

        let isAuthericed: boolean = roles.some(role => user?.role.includes(role));

        if (isAuthericed)
            next();
        else
            next(new HttpException(401, 'Not authorized, no token'));
    };