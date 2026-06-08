"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logout as logoutService } from "@/services/auth.service";

type AuthContextData = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | null>(null);

function saveSessionCookie(isLogged: boolean) {
  if (typeof document === "undefined") return;

  if (isLogged) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `taskflow-auth=1; path=/; max-age=604800; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = "taskflow-auth=; path=/; max-age=0; SameSite=Lax";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      saveSessionCookie(Boolean(currentUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    await logoutService();
    saveSessionCookie(false);
  }

  const value = useMemo(() => ({ user, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext precisa estar dentro de AuthProvider.");
  }

  return context;
}
