import { Events } from "../socket.enum";
import { CustomSocket } from "../schema/socket.interface";

interface IssuesModal {
    message: string;
}
interface ValidationMiddleware {
    success: boolean;
    error: {
        issues: IssuesModal[];
    };
}
export const validationSocketData = (socket: CustomSocket, validationMethod: any, data: any) => {
    const validation: ValidationMiddleware = validationMethod(data);

    if (!validation.success) {
        console.log("--------------IN socket error [not success]--------------".bgRed);
        const errors: string[] = validation?.error?.issues?.map((msg) => msg.message);

        socket.emit(Events.ERROR, errors);
        return false;
    } else {
        return true;
    }
};
