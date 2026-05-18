"use client";

import { useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { useAppStore } from "@/store/useAppStore";

export function useFirebaseSync() {
  const { user } = useAuth();
  const store = useAppStore();
  const hasSynced = useRef(false);
  const isSaving = useRef(false);

  // Load from Firebase when user logs in
  useEffect(() => {
    if (!user || !db || hasSynced.current) return;

    const loadFromFirebase = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          // Firebase has data → load it into store
          const data = snap.data();
          useAppStore.setState({
            cases: data.cases || [],
            newComers: data.newComers || [],
            totalPV: data.totalPV || 0,
            monthlyPV: data.monthlyPV || {},
            dailyStatus: data.dailyStatus || {},
            readBooks: data.readBooks || [],
            celebratedDays: data.celebratedDays || {},
          });
        } else {
          // First time login → migrate localStorage data to Firebase
          const currentState = useAppStore.getState();
          await setDoc(ref, {
            cases: currentState.cases,
            newComers: currentState.newComers,
            totalPV: currentState.totalPV,
            monthlyPV: currentState.monthlyPV,
            dailyStatus: currentState.dailyStatus,
            readBooks: currentState.readBooks,
            celebratedDays: currentState.celebratedDays,
            migratedAt: new Date().toISOString(),
          });
        }

        hasSynced.current = true;
      } catch (err) {
        console.error("Firebase sync error:", err);
      }
    };

    loadFromFirebase();
  }, [user]);

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!user) {
      hasSynced.current = false;
    }
  }, [user]);

  // Save to Firebase whenever store changes (if logged in)
  useEffect(() => {
    if (!user || !db || !hasSynced.current || isSaving.current) return;

    const saveToFirebase = async () => {
      isSaving.current = true;
      try {
        const ref = doc(db, "users", user.uid);
        await setDoc(ref, {
          cases: store.cases,
          newComers: store.newComers,
          totalPV: store.totalPV,
          monthlyPV: store.monthlyPV,
          dailyStatus: store.dailyStatus,
          readBooks: store.readBooks,
          celebratedDays: store.celebratedDays,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Firebase save error:", err);
      } finally {
        isSaving.current = false;
      }
    };

    saveToFirebase();
  }, [user, store.cases, store.newComers, store.totalPV, store.monthlyPV, store.dailyStatus, store.readBooks, store.celebratedDays]);
}
