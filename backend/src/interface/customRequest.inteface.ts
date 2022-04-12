import { IncomingHttpHeaders } from "http";
import { Request } from 'express';
import { UserModel } from "./user.interface";
import { AdminModel } from "./admin.interface";

export interface CustomRequest extends Request {
    headers: IncomingHttpHeaders & {
        user?: UserModel | AdminModel;
    };
}