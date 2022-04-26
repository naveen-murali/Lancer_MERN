export class HttpException extends Error {
    public status: number;
    public message: string;
    public errors: unknown;

    constructor(
        status: number,
        message: string,
        errors: unknown = false
    ) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = this.setError(errors);
    }

    setError = (errors: unknown) => {
        return errors
            ? Array.isArray(errors)
                ? errors
                : [errors]
            : [this.message];
    };
}