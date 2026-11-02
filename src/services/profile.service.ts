/**
 * خدمة الملف الشخصي والإعدادات (Profile & Settings Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

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
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";
import { clearAuthSession } from "@/lib/auth";

let localProfile: UserProfile = { ...mockUserProfile };
let localPreferences: UiPreferences = { ...mockUiPreferences };
let localNotifications: NotificationPreferences = { ...mockNotificationPreferences };

export async function getSettingsData(options: {
  delayMs?: number;
  forceError?: boolean;
} = {}): Promise<SettingsState> {
  const { delayMs = 150, forceError = false } = options;

  if (USE_MOCK_API) {
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

  // في الوضع الفعلي: جلب الملف الشخصي من FastAPI
  const profile = await apiRequest<UserProfile>(API_ENDPOINTS.PROFILE.ME, {
    method: "GET",
  });

  return {
    profile: profile || localProfile,
    preferences: { ...localPreferences },
    notifications: { ...localNotifications },
  };
}

export const getUserProfile = getSettingsData;

export async function updateProfileMock(
  updatedFields: Pick<UserProfile, "name" | "email">
): Promise<UserProfile> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    localProfile = {
      ...localProfile,
      name: updatedFields.name.trim() || localProfile.name,
      email: updatedFields.email.trim() || localProfile.email,
    };
    return { ...localProfile };
  }

  return await apiRequest<UserProfile>(API_ENDPOINTS.PROFILE.UPDATE, {
    method: "PUT",
    body: JSON.stringify(updatedFields),
  });
}

export const updateUserProfile = updateProfileMock;

export async function updateUiPreferencesMock(
  newPreferences: UiPreferences
): Promise<UiPreferences> {
  // تفضيلات الواجهة (الثيم، اللغة، الحركة) تُحفظ محلياً في المتصفح
  await new Promise((resolve) => setTimeout(resolve, 200));
  localPreferences = { ...newPreferences };
  if (typeof window !== "undefined") {
    localStorage.setItem("ui_preferences", JSON.stringify(newPreferences));
  }
  return { ...localPreferences };
}

export const updateUiPreferences = updateUiPreferencesMock;

export async function updateNotificationPreferencesMock(
  newNotifications: NotificationPreferences
): Promise<NotificationPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  localNotifications = { ...newNotifications };
  return { ...localNotifications };
}

export const updateNotificationPreferences = updateNotificationPreferencesMock;

export async function simulateLogoutMock(): Promise<boolean> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    clearAuthSession();
    return true;
  }

  try {
    await apiRequest(API_ENDPOINTS.PROFILE.LOGOUT, {
      method: "POST",
    });
  } finally {
    clearAuthSession();
  }
  return true;
}

export const logoutUser = simulateLogoutMock;
