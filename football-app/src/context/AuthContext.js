import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

// IMPORTANT: the Admin email is NOT hard-coded across the app.
// It lives in a single Firestore document: config/adminConfig.
// This file reads that document once and is the ONLY place role
// is derived from it (see refreshAdminStatus below).

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase auth user
  const [profile, setProfile] = useState(null); // Firestore users/{uid} doc
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [needsNickname, setNeedsNickname] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Replace these with your own OAuth client IDs from Google Cloud Console
    // (Firebase Authentication > Sign-in method > Google gives you these).
    expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((e) =>
        console.warn("Google sign-in error", e)
      );
    }
  }, [response]);

  const refreshAdminStatus = useCallback(async (currentUser) => {
    if (!currentUser?.email) return false;
    try {
      const cfgSnap = await getDoc(doc(db, "config", "adminConfig"));
      const adminEmail = cfgSnap.exists() ? cfgSnap.data().adminEmail : null;
      return !!adminEmail && adminEmail.toLowerCase() === currentUser.email.toLowerCase();
    } catch (e) {
      console.warn("Could not read admin config", e);
      return false;
    }
  }, []);

  const loadOrCreateProfile = useCallback(async (currentUser, admin) => {
    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const base = {
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        role: admin ? "admin" : "user",
        nickname: null,
        createdAt: serverTimestamp(),
      };
      await setDoc(ref, base);
      setProfile(base);
      setNeedsNickname(!admin); // admins skip the nickname prompt
    } else {
      const data = snap.data();
      setProfile(data);
      setNeedsNickname(!admin && !data.nickname);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setInitializing(true);
      if (currentUser) {
        setUser(currentUser);
        const admin = await refreshAdminStatus(currentUser);
        setIsAdmin(admin);
        await loadOrCreateProfile(currentUser, admin);
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setNeedsNickname(false);
      }
      setInitializing(false);
    });
    return unsub;
  }, [refreshAdminStatus, loadOrCreateProfile]);

  async function saveNickname(nickname) {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { nickname }, { merge: true });
    setProfile((p) => ({ ...(p || {}), nickname }));
    setNeedsNickname(false);
  }

  async function signOut() {
    await fbSignOut(auth);
  }

  const value = {
    user,
    profile,
    isAdmin,
    initializing,
    needsNickname,
    signInWithGoogle: () => promptAsync(),
    googleRequestReady: !!request,
    saveNickname,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
