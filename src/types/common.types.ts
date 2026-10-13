/**
 * الأنواع المشتركة الأولية لمنصة ذكاء الأعمال
 */

export type StatusType = "active" | "inactive" | "pending" | "error";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
