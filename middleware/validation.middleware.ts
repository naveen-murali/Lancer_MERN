import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { BadRequestException } from "../exceptions";
import { ValidationMiddleware } from "../interface";

export const ValidateBody = (validationMethod: Function) =>
    asyncHandler((req: Request, _res: Response, next: NextFunction) => {
        console.log(req.body);

        const data: ValidationMiddleware = validationMethod(req.body);

        if (!data.success) {
            console.log("--------------IN validate body middleware--------------");
            const errors: string[] = data?.error?.issues?.map((msg) => msg.message);
            throw new BadRequestException(errors, "Invalide Credentials");
        }

        next();
    });
