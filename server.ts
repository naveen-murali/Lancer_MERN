import colors from "colors";
import { config } from "dotenv";
import cloudinary from "cloudinary";
import { App } from "./app";
import { setupSocketIo } from "./socket";
import { validateEnv } from "./validation";
import { createTwilioClient } from "./config";
import {
    AuthRoutes,
    UserRoutes,
    ServiceRoutes,
    CategoryRoutes,
    ChatRoutes,
    OrderRoutes,
    UploadRoutes,
    TransactionRoutes,
    LancerRoutes,
} from "./routes";

colors.enable();
config();
validateEnv();
createTwilioClient();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCRETE,
});

const app = new App(
    [
        new AuthRoutes(),
        new UserRoutes(),
        new ServiceRoutes(),
        new CategoryRoutes(),
        new ChatRoutes(),
        new OrderRoutes(),
        new TransactionRoutes(),
        new LancerRoutes(),
        new UploadRoutes(),
    ],
    setupSocketIo
);

app.listen();
