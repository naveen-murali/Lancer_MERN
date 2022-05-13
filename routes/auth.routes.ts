import { Router } from "express";
import { Role } from "../util";
import { Routes } from "../interface";
import { AuthController } from "../controllers";
import { checkRoles, protect, ValidateBody } from "../middleware";
import {
    SignupBodyVal,
    SendOtpBodyVal,
    SigninBodyVal,
    SigninGoogleBodyVal,
    SignupGooogleBodyVal,
    SigninAdminBodyVal,
    PhoneVarificationBodyVal,
} from "../validation";

export class AuthRoutes implements Routes {
    public path: string = "/auth";
    public router: Router = Router();
    public authController: AuthController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const auth = this.path;
        const {
            createUser,
            sendOtp,
            signinUser,
            signinUsingGoogle,
            createUsingGoogle,
            signinAdmin,
            varifyPhone,
            linkGoogle,
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

        this.router
            .route(`${auth}/users/:id/phone`)
            .patch(
                protect,
                checkRoles([Role.BUYER]),
                ValidateBody(PhoneVarificationBodyVal.safeParse),
                varifyPhone
            );

        this.router
            .route(`${auth}/users/:id/google`)
            .patch(
                protect,
                checkRoles([Role.BUYER]),
                ValidateBody(SignupGooogleBodyVal.safeParse),
                linkGoogle
            );
    }
}
