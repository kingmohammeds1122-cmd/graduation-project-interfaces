import {
  UserProfile,
  UiPreferences,
  NotificationPreferences,
  SettingsState,
} from "@/types/settings.types";
import {
  mockUserProfile,
  mockUiPreferences,
  mockNotificationPreferences,
} from "@/mocks/settings.mock";

/**
 * خدمة الإعدادات التجريبية (Settings Service)
 * معزولة تماماً وتعمل عبر الوعود (Promises) لمحاكاة حفظ التفضيلات محلياً.
 * تُظهر للمستخدم بوضوح أن أي تعديل هو محاكاة بصرية ولا يُرسل لأي خادم.
 */

let localProfile: UserProfile = { ...mockUserProfile };
let localPreferences: UiPreferences = { ...mockUiPreferences };
let localNotifications: NotificationPreferences = { ...mockNotificationPreferences };

export async function getSettingsData(options: {
  delayMs?: number;
  forceError?: boolean;
} = {}): Promise<SettingsState> {
  const { delayMs = 150, forceError = false } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (forceError) {
    throw new Error("تعذر جلب بيانات الإعدادات التجريبية، يرجى المحاولة لاحقاً.");
  }

  return {
    profile: { ...localProfile },
    preferences: { ...localPreferences },
    notifications: { ...localNotifications },
  };
}

export async function updateProfileMock(
  updatedFields: Pick<UserProfile, "name" | "email">
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  localProfile = {
    ...localProfile,
    name: updatedFields.name.trim() || localProfile.name,
    email: updatedFields.email.trim() || localProfile.email,
  };
  return { ...localProfile };
}

export async function updateUiPreferencesMock(
  newPreferences: UiPreferences
): Promise<UiPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  localPreferences = { ...newPreferences };
  return { ...localPreferences };
}

export async function updateNotificationPreferencesMock(
  newNotifications: NotificationPreferences
): Promise<NotificationPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  localNotifications = { ...newNotifications };
  return { ...localNotifications };
}

export async function simulateLogoutMock(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return true;
}
