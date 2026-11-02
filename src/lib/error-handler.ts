/**
 * معالج الأخطاء المركزي (Central Error Handler)
 * يوحد التعامل مع استجابات HTTP والأخطاء البرمجية وانقطاع الشبكة،
 * ويحولها إلى رسائل عربية واضحة ومفهومة للمستخدم.
 */

import { ApiErrorResponse } from "@/types/api.types";

export class ApiError extends Error {
  public status?: number;
  public data?: unknown;
  public isNetworkError?: boolean;

  constructor(
    message: string,
    status?: number,
    data?: unknown,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;

    // للحفاظ على تتبع المكدس (Stack Trace) في محركات JS الحديثة
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * خريطة الرسائل العربية الافتراضية لرموز استجابة HTTP
 */
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "طلب غير صالح، يرجى التحقق من صحة البيانات المدخلة.",
  401: "انتهت الجلسة أو بيانات الاعتماد غير صالحة، يرجى تسجيل الدخول مجدداً.",
  403: "ليس لديك الصلاحية الكافية للوصول إلى هذا المورد أو تنفيذ هذا الإجراء.",
  404: "المورد أو الصفحة المطلوبة غير موجودة في خادم البيانات.",
  408: "استغرق الطلب وقتاً أطول من المتوقع، يرجى التحقق من اتصال الشبكة.",
  409: "يوجد تعارض في البيانات (البيانات المدخلة موجودة مسبقاً).",
  422: "خطأ في التحقق من صحة البيانات المدخلة (Validation Error)، يرجى مراجعة الحقول.",
  429: "تم تجاوز الحد المسموح به من الطلبات، يرجى الانتظار قليلاً قبل المحاولة.",
  500: "حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً أو إبلاغ الدعم الفني.",
  502: "الخادم غير متاح حالياً (Bad Gateway)، يرجى التأكد من تشغيل خادم FastAPI.",
  503: "الخدمة قيد الصيانة أو غير متاحة مؤقتاً، يرجى المحاولة بعد قليل.",
  504: "انتهت مهلة استجابة بوابة الخادم (Gateway Timeout).",
};

/**
 * استخراج رسالة الخطأ العربية المناسبة لأي استثناء
 */
export function handleApiError(error: unknown): string {
  if (!error) {
    return "حدث خطأ غير معروف، يرجى إعادة المحاولة.";
  }

  // إذا كان الخطأ من فئة ApiError المخصصة
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return "تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت وتشغيل خادم الـ Backend (FastAPI).";
    }

    if (error.status && HTTP_ERROR_MESSAGES[error.status]) {
      // إذا كان الخادم أرجع رسالة تفصيلية صريحة (detail)
      if (error.data && typeof error.data === "object") {
        const errorData = error.data as ApiErrorResponse;
        if (typeof errorData.detail === "string" && errorData.detail.trim()) {
          return errorData.detail;
        }
        if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          const firstDetail = errorData.detail[0];
          return `خطأ في الحقل (${firstDetail.loc?.slice(-1)[0] || "البيانات"}): ${firstDetail.msg}`;
        }
        if (errorData.message && typeof errorData.message === "string") {
          return errorData.message;
        }
      }
      return HTTP_ERROR_MESSAGES[error.status];
    }

    return error.message;
  }

  // خطأ شبكة قياسي (fetch error)
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return "تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الـ Backend على الرابط المحلي المحدد.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "حدث خطأ غير متوقع أثناء معالجة الطلب.";
}
