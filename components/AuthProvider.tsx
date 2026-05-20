"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { fetchMe, apiSend, type Me } from "@/lib/client";

type AuthCtx = {
  user: Me | null;
  ready: boolean;
  setUser: (u: Me | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  ready: false,
  setUser: () => {},
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: Me | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Me | null>(initialUser);
  const [ready] = useState(true);

  const refresh = useCallback(async () => {
    const u = await fetchMe();
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await apiSend("/api/auth/logout", "POST").catch(() => {});
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, ready, setUser, refresh, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
