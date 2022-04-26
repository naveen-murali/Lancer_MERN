import { cleanEnv, port, str,url } from 'envalid';

export const validateEnv = () => {    
    cleanEnv(process.env, {
        NODE_ENV: str(),
        MONGODB_URI: url(),
        PORT: port(),
    });
};