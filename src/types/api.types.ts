/**
 * تعريفات أنواع استجابات وطلبات واجهات البرمجة الموحدة (API Types)
 * متوافقة مع معايير FastAPI واستجابات JSON الموحدة.
 */

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  status?: number;
}

export interface ApiValidationErrorDetail {
  loc?: (string | number)[];
  msg: string;
  type?: string;
}

export interface ApiErrorResponse {
  detail?: string | ApiValidationErrorDetail[];
  message?: string;
  status_code?: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  size?: number;
  pages?: number;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}
