export interface IssuesModel {
    message: string;
}
export interface ValidationMiddleware {
    success: boolean;
    error: {
        issues: IssuesModel[];
    };
}
