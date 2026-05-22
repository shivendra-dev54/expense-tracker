"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthGuard(
  { children }: { children: React.ReactNode }
) {
  const router = useRouter();
  const [hasLoadedStore, setHasLoadedStore] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() => setHasLoadedStore(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setHasLoadedStore(true));
    if (useAuthStore.persist.hasHydrated()) {
      setHasLoadedStore(true);
    }
    return () => {
      unsubHydrate();
      unsubFinish();
    };
  }, []);


  useEffect(() => {
    if (!hasLoadedStore) return;
    if (!user) {
      router.push("/auth")
    }
  }, [hasLoadedStore, router, user]);


  if (!hasLoadedStore) {
    return (
      <div className="bg-slate-900 text-white flex justify-center align-middle flex-col flex-1 text-center">
        Loading your profile...
      </div>
    );
  }

  return <>{children}</>
}