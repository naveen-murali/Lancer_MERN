namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: string;
        BODY_LIMIT: string;
        MULTER_FILE_LIMIT: string;
        MONGODB_URI: string;
        PRIVATE_KEY: string;
        PUBLIC_KEY: string;
        ACCOUNTS_ID: string;
        AUTH_TOKEN: string;
        GOOGLE_CLIENT_ID: string;
        CLOUD_NAME: string;
        API_KEY: string;
        API_SCRETE: string;
    }
}