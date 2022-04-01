import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions';
import { CustomRequest, UserModel } from '../interface';

import { AuthService } from '../services';
import { AuthResponse, Role } from '../util';
import {
    SignupBody,
    SendOtpBody,
    SigninBody,
    SigninGoogleBody,
    SignupGooogleBody,
    PhoneVarificationBody
} from '../validation';

export class AuthController {
    public authService: AuthService = new AuthService();


    // @desc       Signup for the users
    // @rout       POST /auth/user/signup
    createUser = asyncHandler(async (req: Request, res: Response) => {
        const user: SignupBody = req.body;
        const createdUser = await this.authService.createUser(user);

        res.status(201)
            .json(new AuthResponse(
                createdUser,
                this.generateToken(createdUser._id, createdUser.role)
            ));
    });


    // @desc       Signup with google for the users
    // @rout       POST /auth/user/signup/google
    createUsingGoogle = asyncHandler(async (req: Request, res: Response) => {
        const body: SignupGooogleBody = req.body;
        const createdUser = await this.authService.createUsingGoogle(body.tokenId);

        res.status(201)
            .json(new AuthResponse(
                createdUser,
                this.generateToken(createdUser._id, createdUser.role)
            ));
    });


    // @desc       Signin for the user
    // @rout       POST /auth/users/signin
    signinUser = asyncHandler(async (req: Request, res: Response) => {
        const body: SigninBody = req.body;
        const user = await this.authService.signinUser(body.email, body.password);

        res.json(new AuthResponse(
            user,
            this.generateToken(user._id, user.role)
        ));
    });


    // @desc       Signin with google for the user
    // @rout       POST /auth/users/signin/google
    signinUsingGoogle = asyncHandler(async (req: Request, res: Response) => {
        const body: SigninGoogleBody = req.body;

        const user = await this.authService.signinUsingGoogle(body.googleId);

        res.json(new AuthResponse(
            user,
            this.generateToken(user._id, user.role)
        ));
    });


    // @desc        Sign in for the admin
    // @rout        POST /auth/admin/signin
    signinAdmin = asyncHandler(async (req: Request, res: Response) => {
        const body: SigninBody = req.body;
        const admin = await this.authService.signinAdmin(body.email, body.password);

        res.json({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: this.generateToken(admin._id, admin.role)
        });
    });


    // @desc       Varify the users phone number
    // @rout       PATCH /auth/users/:id/phone
    varifyPhone = asyncHandler(async (req: CustomRequest, res: Response) => {
        const id = req.params.id as unknown as string;
        const user = <UserModel>req.headers['user'];

        if (user && user._id && user._id.toString() !== id)
            throw new HttpException(401, "Invalied credential");

        const body: PhoneVarificationBody = req.body;
        await this.authService.varifyPhone(id, body);

        res.status(201).json({ phone: body.phone, status: "varified" });
    });


    // @desc       Link google account
    // @rout       PATCH /auth/users/:id/google
    linkGoogle = asyncHandler(async (req: CustomRequest, res: Response) => {
        const id = req.params.id as unknown as string;
        const user = <UserModel>req.headers['user'];
        const body = <SignupGooogleBody>req.body;

        if (user && user._id && user._id.toString() !== id)
            throw new HttpException(401, "Invalied credential");

        const email = await this.authService.linkGoogle(id, body.tokenId);

        res.status(201).json({ email, status: "varified" });
    });


    // @desc       OTP requiest for the user
    // @rout       POST /auth/otp
    sendOtp = asyncHandler(async (req: Request, res: Response) => {
        const { phone }: SendOtpBody = req.body;
        await this.authService.sendOtp(phone);

        res.status(201).json({ phone });
    });


    // @desc       General method form token generation.
    generateToken = (id: string, role: Role[]) => {
        return jwt.sign({ id, role }, `${process.env.JWT_SECRET}`, {
            expiresIn: '10d',
        });
    };
}