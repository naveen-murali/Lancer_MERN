namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: string;
        APP_URL: string;
        BODY_LIMIT: string;
        MULTER_FILE_LIMIT: string;
        MONGODB_URI: string;
        PUBLIC_KEY: string;
        ACCOUNTS_ID: string;
        AUTH_TOKEN: string;
        GOOGLE_CLIENT_ID: string;
        CLOUD_NAME: string;
        API_KEY: string;
        API_SCRETE: string;

        FIREBASE_PROJECT_ID: string;
        FIREBASE_CLIENT_EMAIL: string;
        FIREBASE_PRIVATE_KEY: string;

        PAYPAL_CLIENT: string;
        PAYPAL_SECRET: string;
    }
}