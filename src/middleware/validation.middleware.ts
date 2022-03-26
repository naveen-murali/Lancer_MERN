import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { BadRequestException, NotFoundException } from '../exceptions';

interface IssuesInter {
    message: string;
}
interface ValidationMiddleware {
    success: boolean;
    error: {
        issues: IssuesInter[];
    };
}

export const ValidateBody = (validationMethod: Function) =>
    asyncHandler((req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        
        const data: ValidationMiddleware = validationMethod(req.body);

        if (!data.success) {
            console.log('--------------IN validate body middleware [not success]--------------');
            const errors: string[] = data?.error?.issues?.map(msg => msg.message);
            throw new BadRequestException("Invalide Credentials", errors);
        }

        next();
    });