import admin from 'firebase-admin';

export const connectFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.PROJECT_ID,
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: process.env.PRIVATE_KEY
        })
    });
};

export { admin };