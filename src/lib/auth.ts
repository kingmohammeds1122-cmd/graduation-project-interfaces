/**
 * مكتبة إدارة جلسة المستخدم والتوكن (Client Auth Manager)
 * متوافقة مع FastAPI (JWT Bearer Token) وتدعم المزامنة بين LocalStorage وكوكيز المتصفح.
 */

import { User } from "@/types/user.types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * جلب رمز المصادقة (Bearer Token)
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // 1. القراءة من LocalStorage
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) {
    return localToken;
  }

  // 2. محاولة القراءة من الكوكيز
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${TOKEN_KEY})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * حفظ رمز المصادقة في الذاكرة والكوكيز
 */
export function setToken(token: string, maxAgeSeconds: number = 604800): void {
  if (typeof window === "undefined") return;

  // الحفظ في LocalStorage
  localStorage.setItem(TOKEN_KEY, token);

  // المزامنة مع الكوكيز ليتمكن وسيط Next.js (Middleware) من قراءتها
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(
    token
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * إزالة رمز المصادقة
 */
export function removeToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * حفظ بيانات المستخدم الحالية
 */
export function setCurrentStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * جلب بيانات المستخدم المحفوظة
 */
export function getCurrentStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/**
 * التحقق من وجود جلسة نشطة
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * مسح الجلسة والتوكن بالكامل
 */
export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  removeToken();
  localStorage.removeItem(USER_KEY);
}
