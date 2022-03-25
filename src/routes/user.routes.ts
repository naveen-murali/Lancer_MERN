import { Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from "../interface";
import { protect, checkRoles } from '../middleware';
import { Role } from '../util';

export class UserRoutes implements Routes {
    public path: string = "/users";
    public router: Router = Router();
    public userController: UserController = new UserController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const users = this.path;
        const { getAllUsers, getUserById } = this.userController;

        this.router
            .route(`${users}`)
            .all(protect)
            .get(checkRoles([Role.ADMIN]), getAllUsers);

        this.router
            .route(`${users}/:id`)
            .all(protect)
            .get(getUserById);
    }

}