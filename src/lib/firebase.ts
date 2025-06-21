// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate the Firebase config to provide a more helpful error message.
const hasPlaceholderValues = Object.values(firebaseConfig).some(
  (value) => !value || value.startsWith('YOUR_') || value.includes('your-project-id')
);

export const isFirebaseConfigured = !hasPlaceholderValues;

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // If config is provided but fails, it's a real error.
    throw new Error(
      "Failed to initialize Firebase. Please double-check that the credentials in your .env file are correct."
    );
  }
}

export { app, auth };