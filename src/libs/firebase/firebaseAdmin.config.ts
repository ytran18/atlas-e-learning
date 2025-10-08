import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Only initialize if not already initialized
if (!admin.apps.length) {
    // For production (Vercel), use environment variables
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // In Vercel, replace \n with actual newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
    }
    // For local development with service account JSON
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    } else {
        console.warn(
            "Firebase Admin SDK is not initialized. Please set up environment variables."
        );
    }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { admin, adminAuth, adminDb };

