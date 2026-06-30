"use client";

import { useSession as useNextSession } from "next-auth/react";

export function useSession() {
  const session = useNextSession();
  return {
    user: session.data?.user,
    isLoading: session.status === "loading",
    isAuthenticated: session.status === "authenticated",
  };
}
