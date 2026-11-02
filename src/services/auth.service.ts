/**
 * خدمة المصادقة والجلسة (Auth Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";
import {
  setToken,
  removeToken,
  setCurrentStoredUser,
  getCurrentStoredUser,
  clearAuthSession,
} from "@/lib/auth";
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/user.types";

const MOCK_USER: User = {
  id: "user-mock-1",
  name: "أحمد المهندس",
  email: "ahmed@example.com",
  role: "مسؤول النظام (Admin)",
  organization: "هيئة ذكاء الأعمال والبيانات",
  createdAt: "2026-01-15",
  isMock: true,
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK_API) {
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!credentials.email || !credentials.password) {
      throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
    }

    const mockResponse: AuthResponse = {
      token: "mock-jwt-token-bi-platform-2026",
      tokenType: "Bearer",
      user: {
        ...MOCK_USER,
        email: credentials.email,
        name: credentials.email.split("@")[0] || MOCK_USER.name,
      },
      expiresIn: 86400,
    };

    setToken(mockResponse.token);
    setCurrentStoredUser(mockResponse.user);
    return mockResponse;
  }

  // الاتصال الفعلي بـ FastAPI
  const response = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });

  if (response.token) {
    setToken(response.token, response.expiresIn || 604800);
    setCurrentStoredUser(response.user);
  }

  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!data.email || !data.password) {
      throw new Error("يرجى إدخال جميع بيانات التسجيل المطلوبة.");
    }

    const mockResponse: AuthResponse = {
      token: "mock-jwt-token-new-user-2026",
      tokenType: "Bearer",
      user: {
        ...MOCK_USER,
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name || data.email.split("@")[0],
      },
      expiresIn: 86400,
    };

    setToken(mockResponse.token);
    setCurrentStoredUser(mockResponse.user);
    return mockResponse;
  }

  const response = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(data),
    requiresAuth: false,
  });

  if (response.token) {
    setToken(response.token, response.expiresIn || 604800);
    setCurrentStoredUser(response.user);
  }

  return response;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      message: `تم إرسال رابط استعادة كلمة المرور تجريبياً إلى (${email}).`,
    };
  }

  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    {
      method: "POST",
      body: JSON.stringify({ email }),
      requiresAuth: false,
    }
  );
}

export async function logout(): Promise<void> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    clearAuthSession();
    return;
  }

  try {
    await apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });
  } finally {
    clearAuthSession();
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (USE_MOCK_API) {
    const stored = getCurrentStoredUser();
    return stored || MOCK_USER;
  }

  try {
    const user = await apiRequest<User>(API_ENDPOINTS.AUTH.ME, {
      method: "GET",
    });
    setCurrentStoredUser(user);
    return user;
  } catch {
    removeToken();
    return null;
  }
}
