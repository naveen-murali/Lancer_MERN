import { Role } from "../util";

interface Image {
    public_id: string;
    url: string;
}

export interface AdminModel {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    image?: Image;
    role: Role[];
    createdAt?: Date;
    updatedAt?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
