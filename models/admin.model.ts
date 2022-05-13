import {
    Schema,
    model,
    Document,
    CallbackWithoutResultAndOptionalError,
} from "mongoose";
import { hash, genSalt, compare } from "bcrypt";
import { Coll, Role } from "../util";
import { AdminModel } from "../interface";
import { Image } from "./common.schema";

const AdminSchema: Schema = new Schema(
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
        password: {
            type: String,
            required: false,
        },
        image: {
            type: Image,
            required: false,
        },
        role: {
            type: Array,
            required: true,
            default: [Role.ADMIN],
        },
    },
    {
        timestamps: true,
    }
);

AdminSchema.methods.matchPassword =
    async function matchPassword(enteredPassword: string) {
        return await compare(enteredPassword, this.password);
    };

AdminSchema.pre(
    "save",
    async function (next: CallbackWithoutResultAndOptionalError) {
        if (!this.isModified("password"))
            next();

        let salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    }
);

export const Admin = model<AdminModel & Document>("Admin", AdminSchema, Coll.ADMIN);
