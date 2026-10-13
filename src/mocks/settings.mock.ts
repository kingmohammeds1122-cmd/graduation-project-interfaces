import {
  UserProfile,
  UiPreferences,
  NotificationPreferences,
} from "@/types/settings.types";

/**
 * بيانات الإعدادات التجريبية (Mock Settings Data)
 * ملاحظة هامة: كافة البيانات هنا هي عينات افتراضية مخصصة للمعاينة،
 * ولا ترتبط بأي حساب خادم حقيقي أو جلسة مستخدم فعلية.
 */

export const mockUserProfile: UserProfile = {
  name: "سارة المنصور",
  email: "sara.almansoor@enterprise.local",
  organization: "الشركة المتقدمة للحلول الرقمية",
  workspaceName: "مساحة تحليلات ذكاء الأعمال والمالية",
  roleLabel: "محلل بيانات معتمد (عرض واستعلام فقط)",
  accountType: "حساب مؤسسي موثق (محاكاة)",
  joinedDate: "أغسطس 2026",
  avatarText: "س",
  isMock: true,
};

export const mockUiPreferences: UiPreferences = {
  language: "ar",
  theme: "light",
  compactMode: false,
  fontSize: "normal",
  showAiGuidanceTips: true,
};

export const mockNotificationPreferences: NotificationPreferences = {
  emailReportsDigest: true,
  sourceSyncAlerts: true,
  queryCompletionNotices: false,
  systemMaintenanceUpdates: true,
};
