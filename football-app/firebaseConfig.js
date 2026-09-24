// Firebase initialization
// This file connects the app to your Firebase project (ourxi-74df7).
// Do not commit real API keys to a public repo if you open-source this project.

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAGmT3URyGehhFwXXkLF7BZVgQKvMCNxZY",
  authDomain: "ourxi-74df7.firebaseapp.com",
  projectId: "ourxi-74df7",
  storageBucket: "ourxi-74df7.firebasestorage.app",
  messagingSenderId: "568010634478",
  appId: "1:568010634478:web:b4cc8ad52d07816a64efff",
};

// Avoid re-initializing on fast-refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth =
    Platform.OS === "web"
      ? getAuth(app)
      : initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
