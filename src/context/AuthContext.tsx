"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/user.types";
import { USE_MOCK_API } from "@/lib/api-config";
import * as authService from "@/services/auth.service";
import { getToken, getCurrentStoredUser } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  isLoading: boolean;
  isConfigured: boolean;
  isMockMode: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  // إعداد البيئة متاح دائماً سواء بوضع المحاكاة أو الاتصال بالخادم
  const isConfigured = USE_MOCK_API || isSupabaseConfigured;

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined" && USE_MOCK_API) {
      return getCurrentStoredUser();
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => !USE_MOCK_API);

  // تحديث الجلسة
  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK_API) {
        const stored = getCurrentStoredUser();
        const hasToken = getToken();
        if (hasToken && stored) {
          setUser(stored);
        } else {
          setUser(null);
        }
      } else {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // التحقق المبدئي عند بدء التحميل في حال الاتصال بـ FastAPI
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (!USE_MOCK_API) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      session: user ? { user } : null,
      isLoading,
      isConfigured,
      isMockMode: USE_MOCK_API,
      login: handleLogin,
      register: handleRegister,
      signOut,
      refreshSession,
    }),
    [user, isLoading, isConfigured, handleLogin, handleRegister, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
