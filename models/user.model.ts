import { Schema, model, Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";
import { Coll, Role } from "../util";
import { UserModel } from "../interface";
import { Image } from "./common.schema";

const userSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: false,
            unique: true,
        },
        isEmailVarified: {
            type: Boolean,
            required: false,
        },
        isPhoneVerified: {
            type: Boolean,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        image: {
            type: Image,
            required: false,
        },
        googleId: {
            type: String,
            required: false,
        },
        role: {
            type: Array,
            required: true,
            default: [Role.BUYER],
        },
        wallet: {
            type: Number,
            required: true,
            default: 0,
        },
        withdrawedWallet: {
            type: Number,
            required: true,
            default: 0,
        },
        referralId: {
            type: String,
            required: true,
        },
        referralNum: {
            type: Number,
            required: true,
            default: 0,
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function matchPassword(enteredPassword: string) {
    return await compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) next();

    let salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

export const User = model<UserModel & Document>("User", userSchema, Coll.USER);
