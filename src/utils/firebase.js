// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasConfig = !!firebaseConfig.apiKey;
let app = null;
let _storage = null;
let _db = null;

if (hasConfig) {
  app = initializeApp(firebaseConfig);
  _storage = getStorage(app);
  _db = getFirestore(app);
}

const missingError =
  "Missing Firebase config. Add NEXT_PUBLIC_FIREBASE_* vars to .env.local";

function throwOnMissing(name) {
  throw new Error(`${missingError} (required for ${name})`);
}

// Export real instances or proxies that throw on first use when config is missing
export const storage = hasConfig
  ? _storage
  : new Proxy(
      {},
      {
        get() {
          throwOnMissing("storage");
        },
      }
    );

export const db = hasConfig
  ? _db
  : new Proxy(
      {},
      {
        get() {
          throwOnMissing("Firestore");
        },
      }
    );
