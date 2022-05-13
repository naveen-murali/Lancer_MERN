import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import { MongoError } from "mongodb";
import { HttpException } from "../exceptions";

export const errorMiddleware = (
    err: HttpException | MongoError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    if (err instanceof Error.ValidationError)
        res.status(400).json({
            message: "Credentials are incorrect",
            error: Object.values(err.errors).map((err) => err.message),
        });
        
    else if ((err as MongoError).code === 11000)
        res.status(409).json({
            messsage: "Credentials are already in use",
            error: ["Credentials are already in use"],
        });
        
    else if (err instanceof HttpException) {
        const status = err.status || 500;
        const message = err.message || "Something went wrong!";
        const errors = err.errors;

        res.status(status).json({ message, errors });
    } 
    else
        res.status(500).json({
            message: err.message,
            error: [err.message],
        });
};
