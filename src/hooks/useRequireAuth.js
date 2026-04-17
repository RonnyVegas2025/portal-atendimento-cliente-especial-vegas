"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth(allowedRoles = []) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profile || profile.active === false) {
      router.replace("/login");
      return;
    }

    if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
      router.replace("/");
    }
  }, [user, profile, loading, router, allowedRoles]);

  return { user, profile, loading };
}
