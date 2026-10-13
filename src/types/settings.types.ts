/**
 * تعريفات أنواع شاشة الإعدادات والتفضيلات (Settings Types)
 */

export type SettingsTab = "profile" | "preferences" | "notifications" | "security_overview";

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  workspaceName: string;
  roleLabel: string; // للعرض فقط (Read-only) ولا يمكن تعديل الصلاحيات
  accountType: string;
  joinedDate: string;
  avatarText: string;
  isMock: boolean;
}

export type InterfaceLanguage = "ar" | "en";
export type InterfaceTheme = "light" | "system";
export type InterfaceFontSize = "normal" | "large";

export interface UiPreferences {
  language: InterfaceLanguage;
  theme: InterfaceTheme;
  compactMode: boolean;
  fontSize: InterfaceFontSize;
  showAiGuidanceTips: boolean;
}

export interface NotificationPreferences {
  emailReportsDigest: boolean;
  sourceSyncAlerts: boolean;
  queryCompletionNotices: boolean;
  systemMaintenanceUpdates: boolean;
}

export interface SettingsState {
  profile: UserProfile;
  preferences: UiPreferences;
  notifications: NotificationPreferences;
}
