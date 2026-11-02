/**
 * ملف إعدادات وثوابت واجهات البرمجة (API Configuration & Endpoints)
 * وفقاً لوثيقة الفريق الرسمية (Frontend.pdf).
 *
 * عند استلام المسارات النهائية من فريق الـ Backend (FastAPI)، يتم تعديل المسارات
 * في هذا الملف فقط دون الحاجة للمساس بأي شاشة أو مكون في الواجهة.
 */

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// التحقق من تفعيل وضع المحاكاة (افتراضياً true لتشغيل الواجهات بدون خادم)
export const USE_MOCK_API: boolean =
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

/**
 * خريطة المسارات الافتراضية للـ API مقسمة حسب الشاشات الثماني للمنصة
 */
export const API_ENDPOINTS = {
  // 1. المصادقة والجلسة (Auth)
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/auth/me",
  },

  // 2. لوحة التحكم والمؤشرات (Dashboard)
  DASHBOARD: {
    SUMMARY: "/api/v1/dashboard/summary",
    DATA_SOURCES: "/api/v1/data-sources",
    DOCUMENTS_SUMMARY: "/api/v1/documents/summary",
    RECENT_REPORTS: "/api/v1/reports/recent",
  },

  // 3. مصادر البيانات (Data Sources)
  DATA_SOURCES: {
    LIST: "/api/v1/data-sources",
    CREATE: "/api/v1/data-sources",
    DETAIL: (id: string | number) => `/api/v1/data-sources/${id}`,
    TEST_CONNECTION: (id: string | number) => `/api/v1/data-sources/${id}/test-connection`,
  },

  // 4. المستندات وقاعدة المعرفة (Documents)
  DOCUMENTS: {
    LIST: "/api/v1/documents",
    UPLOAD: "/api/v1/documents",
    DETAIL: (id: string | number) => `/api/v1/documents/${id}`,
    STATUS: (id: string | number) => `/api/v1/documents/${id}/status`,
    RETRY: (id: string | number) => `/api/v1/documents/${id}/retry`,
  },

  // 5. محادثة الذكاء الاصطناعي (AI Chat)
  AI_CHAT: {
    ASK: "/api/v1/ai/ask",
    CONVERSATIONS: "/api/v1/conversations",
    MESSAGES: (id: string | number) => `/api/v1/conversations/${id}/messages`,
  },

  // 6. التحليلات ومؤشرات الأداء (Analytics)
  ANALYTICS: {
    SUMMARY: "/api/v1/analytics",
    QUERY: "/api/v1/analytics/query",
    DETAIL: (id: string | number) => `/api/v1/analytics/${id}`,
  },

  // 7. التقارير وسجلات التصدير (Reports)
  REPORTS: {
    LIST: "/api/v1/reports",
    CREATE: "/api/v1/reports",
    DETAIL: (id: string | number) => `/api/v1/reports/${id}`,
    DOWNLOAD: (id: string | number) => `/api/v1/reports/${id}/download`,
  },

  // 8. الملف الشخصي والإعدادات (Profile & Settings)
  PROFILE: {
    ME: "/api/v1/auth/me",
    UPDATE: "/api/v1/users/me",
    LOGOUT: "/api/v1/auth/logout",
  },
} as const;

export default API_ENDPOINTS;
