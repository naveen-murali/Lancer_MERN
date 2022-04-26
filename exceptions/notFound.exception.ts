import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
    public status: number;
    public message: string;
    public errors: unknown;

    constructor(
        errors: unknown = null,
        message: string = "Not found exception",
    ) {
        super(404, message, errors);
        this.status = 404;
        this.message = message;
        this.errors = this.setError(errors);
    }
}