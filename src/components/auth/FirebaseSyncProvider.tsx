"use client";

import { useFirebaseSync } from "@/lib/useFirebaseSync";

export function FirebaseSyncProvider({ children }: { children: React.ReactNode }) {
  useFirebaseSync();
  return <>{children}</>;
}
