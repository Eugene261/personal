import * as admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
    try {
        if (privateKey) {
            const cert = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            };

            admin.initializeApp({
                credential: admin.credential.cert(cert),
                storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
            });
        } else {
            // Dummy init for Next.js build step when env vars are missing
            admin.initializeApp({
                projectId: 'dummy-project-id',
                storageBucket: 'dummy-bucket.appspot.com'
            });
        }
    } catch (error: any) {
        console.error('Firebase Admin Initialization Error:', error.stack);
    }
}

export const db = admin.firestore();
export const storage = admin.storage();
export default admin;
