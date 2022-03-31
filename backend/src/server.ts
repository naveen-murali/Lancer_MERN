import { config } from "dotenv";
import { App } from './app';
import { validateEnv } from './validation';
import { createTwilioClient } from './config';
import cloudinary from 'cloudinary';

import {
    AuthRoutes,
    CategoryRoutes,
    UploadRoutes,
    UserRoutes
} from './routes';

config();
validateEnv();
createTwilioClient();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCRETE
});

const app = new App(
    [new AuthRoutes(), new UserRoutes(), new UploadRoutes(), new CategoryRoutes()]
);

app.listen();