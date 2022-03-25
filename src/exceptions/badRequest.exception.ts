import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
    public status: number;
    public message: string;
    public errors: unknown;

    constructor(
        message: string = "bad request exception",
        errors: unknown = null
    ) {
        super(400, message, errors || [message]);
        this.status = 400;
        this.message = message;
        this.errors = errors || [message];
    }
}