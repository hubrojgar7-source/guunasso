// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Check if we should use Firebase emulators based on environment
const useEmulators = false; // Set to true to use local emulators

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development environment if enabled
if (useEmulators) {
  // Auth emulator typically runs on port 9099
  connectAuthEmulator(auth, "http://localhost:9099");
  
  // Firestore emulator typically runs on port 8080
  connectFirestoreEmulator(db, "localhost", 8080);
  
  // Storage emulator typically runs on port 9199
  connectStorageEmulator(storage, "localhost", 9199);
  
  console.log("Using Firebase emulators");
}

// Set up connection state monitoring
let isFirestoreConnected = true;

// Function to toggle online/offline mode
export const toggleFirestoreNetwork = async (online: boolean) => {
  if (online) {
    try {
      await enableNetwork(db);
      console.log("Firestore network connection enabled");
      isFirestoreConnected = true;
    } catch (error) {
      console.error("Failed to enable Firestore network:", error);
    }
  } else {
    try {
      await disableNetwork(db);
      console.log("Firestore network connection disabled");
      isFirestoreConnected = false;
    } catch (error) {
      console.error("Failed to disable Firestore network:", error);
    }
  }
};

// Connection state getter
export const getFirestoreConnectionState = () => isFirestoreConnected;

// Handle connection errors
window.addEventListener('online', () => {
  console.log("Browser reports online status");
  toggleFirestoreNetwork(true).catch(console.error);
});

window.addEventListener('offline', () => {
  console.log("Browser reports offline status");
  toggleFirestoreNetwork(false).catch(console.error);
});

export { app, analytics, auth, db, storage }; 