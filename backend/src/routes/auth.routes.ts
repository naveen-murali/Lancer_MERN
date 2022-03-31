import { Router } from 'express';
import { Routes } from "../interface";
import { ValidateBody } from '../middleware';

import { AuthController } from '../controllers';
import {
    SignupBodyVal,
    SendOtpBodyVal,
    SigninBodyVal,
    SigninGoogleBodyVal,
    SignupGooogleBodyVal,
    SigninAdminBodyVal
} from '../validation';

export class AuthRoutes implements Routes {
    public path: string = "/auth";
    public router: Router = Router();
    public authController: AuthController = new AuthController();

    constructor() { this.initializeRoutes(); }

    initializeRoutes(): void {
        const auth = this.path;
        const {
            createUser,
            sendOtp,
            signinUser,
            signinUsingGoogle,
            createUsingGoogle,
            signinAdmin
        } = this.authController;


        this.router
            .route(`${auth}/users/signup`)
            .post(ValidateBody(SignupBodyVal.safeParse), createUser);

        this.router
            .route(`${auth}/users/signup/google`)
            .post(ValidateBody(SignupGooogleBodyVal.safeParse), createUsingGoogle);

        this.router
            .route(`${auth}/users/signin`)
            .post(ValidateBody(SigninBodyVal.safeParse), signinUser);

        this.router
            .route(`${auth}/users/signin/google`)
            .post(ValidateBody(SigninGoogleBodyVal.safeParse), signinUsingGoogle);
        
        this.router
            .route(`${auth}/admin/signin`)
            .post(ValidateBody(SigninAdminBodyVal.safeParse), signinAdmin);

        this.router
            .route(`${auth}/otp`)
            .post(ValidateBody(SendOtpBodyVal.safeParse), sendOtp);
    }

}