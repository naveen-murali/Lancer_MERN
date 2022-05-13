namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production";
        PORT: string;
        APP_URL: string;
        BODY_LIMIT: string;
        JWT_SECRET: string;
        MULTER_FILE_LIMIT: string;
        MONGODB_URI: string;
        PUBLIC_KEY: string;

        TWILIO_SERVICE_ID: string;
        TWILIO_ACCOUNTS_ID: string;
        TWILIO_AUTH_TOKEN: string;

        GOOGLE_CLIENT_ID: string;

        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SCRETE: string;

        FIREBASE_PROJECT_ID: string;
        FIREBASE_CLIENT_EMAIL: string;
        FIREBASE_PRIVATE_KEY: string;

        PAYAL_MODE: string;
        PAYPAL_CLIENT: string;
        PAYPAL_SECRET: string;

        REDIS_URL: string;
    }
}
