/**
 * عميل الاتصال المركزي بواجهات البرمجة (Centralized API Client)
 * تم تنفيذه وفقاً للقسم الخامس من وثيقة الفريق الرسمية (Frontend.pdf).
 *
 * يقوم بـ:
 * 1. بناء الرابط الكامل اعتماداً على API_BASE_URL
 * 2. حقن ترويسة المصادقة (Bearer Token) تلقائياً من auth.ts
 * 3. ضبط نوع المحتوى (Content-Type)
 * 4. التقاط أخطاء HTTP وأخطاء الشبكة وتمريرها عبر error-handler.ts
 */

import { API_BASE_URL } from "./api-config";
import { getToken } from "./auth";
import { ApiError } from "./error-handler";
import { RequestOptions } from "@/types/api.types";

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, requiresAuth = true, headers: customHeaders, ...fetchOptions } = options;

  // 1. تحديد الرابط الكامل (Full URL)
  let url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  // إضافة معلمات الاستعلام (Query Parameters) إن وجدت
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // 2. إعداد الترويسات (Headers)
  const headers = new Headers(customHeaders || {});

  // ضبط نوع المحتوى لـ JSON إذا لم يكن الجسم FormData
  if (!(fetchOptions.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // حقن رمز المصادقة (Bearer Token)
  if (requiresAuth && !headers.has("Authorization")) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // 3. تنفيذ الطلب عبر fetch
  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (err: unknown) {
    // خطأ في الاتصال بالشبكة أو الخادم مغلق
    const message = err instanceof Error ? err.message : "تعذر الاتصال بالخادم";
    throw new ApiError(message, undefined, undefined, true);
  }

  // 4. معالجة استجابات الخطأ (HTTP Status >= 400)
  if (!response.ok) {
    let errorData: unknown = null;
    let fallbackMessage = `فشل الطلب مع رمز الحالة: ${response.status}`;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        fallbackMessage = await response.text();
      }
    } catch {
      // تعذر استخراج تفاصيل الخطأ من الجسم
    }

    throw new ApiError(fallbackMessage, response.status, errorData);
  }

  // 5. في حال كانت الاستجابة فارغة (مثل 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // 6. استخراج البيانات والتحويل إلى JSON
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data as T;
    }
    const textData = await response.text();
    return textData as unknown as T;
  } catch (err) {
    throw new ApiError(
      "تعذر معالجة استجابة الخادم بصيغة JSON.",
      response.status,
      err
    );
  }
}

export default apiRequest;
