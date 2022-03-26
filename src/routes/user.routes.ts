import { Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from "../interface";
import { protect, checkRoles, ValidateBody } from '../middleware';
import { Role } from '../util';
import { AddSellerInfoBodyVal } from '../validation';

export class UserRoutes implements Routes {
    public path: string = "/users";
    public router: Router = Router();
    public userController: UserController = new UserController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const users = this.path;
        const {
            getAllUsers,
            getUserById,
            addSellerInfo
        } = this.userController;

        this.router
            .route(`${users}`)
            .get(protect, checkRoles([Role.ADMIN]), getAllUsers);

        this.router
            .route(`${users}/sellers`)
            .post(protect, checkRoles([Role.BUYER]), ValidateBody(AddSellerInfoBodyVal.safeParse), addSellerInfo);

        this.router
            .route(`${users}/:id`)
            .get(protect, getUserById);
    }

}