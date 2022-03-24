import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserService } from '../services';

interface SearchInter {
    search: string;
    page: string;
    pages: string;
    pageSize: string;
    sort: Object;
}

export class UserController {

    public userService: UserService = new UserService();


    // @desc        Get all the users
    // @rout        POST /users
    // @acce        Admin
    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as SearchInter;
        const users = await this.userService.getAllUsers(query);

        res.json(users);
    });
}