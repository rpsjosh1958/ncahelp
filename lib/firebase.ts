import { type FirebaseApp, getApps, initializeApp } from "firebase/app";

// Not called anywhere yet — the app runs entirely on lib/api/* + local JSON
// for this demo. Kept here so a real backend can drop in by calling
// getFirebaseApp() from lib/api/* without restructuring the app.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;

// TODO: call this from lib/api/* once a Firebase-backed API replaces the JSON seams
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}
