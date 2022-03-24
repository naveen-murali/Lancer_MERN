import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
    public status: number;
    public message: string;
    public errors: unknown;

    constructor(
        message: string = "Not found exception",
        errors: unknown = null
    ) {
        super(400, message, errors || message);
        this.status = 400;
        this.message = message;
        this.errors = errors || message;
    }
}