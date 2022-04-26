import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
    public status: number;
    public message: string;
    public errors: unknown;

    constructor(
        errors: unknown = null,
        message: string = "bad request exception"
    ) {
        super(400, message, errors);
        this.status = 400;
        this.message = message;
        this.errors = this.setError(errors);
    }
}