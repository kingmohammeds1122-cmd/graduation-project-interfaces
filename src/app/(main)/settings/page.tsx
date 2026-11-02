"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  RotateCcw,
} from "lucide-react";
import {
  SettingsTab,
  UserProfile,
  UiPreferences,
  NotificationPreferences,
} from "@/types/settings.types";
import {
  mockUserProfile,
  mockUiPreferences,
  mockNotificationPreferences,
} from "@/mocks/settings.mock";
import {
  updateProfileMock,
  updateUiPreferencesMock,
  updateNotificationPreferencesMock,
  simulateLogoutMock,
} from "@/services/settings.service";
import SettingsNavTabs from "@/features/settings/SettingsNavTabs";
import ProfileSection from "@/features/settings/ProfileSection";
import PreferencesSection from "@/features/settings/PreferencesSection";
import NotificationsSection from "@/features/settings/NotificationsSection";
import SecurityOverviewSection from "@/features/settings/SecurityOverviewSection";
import LogoutConfirmModal from "@/features/settings/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // الحالة المحلية للبيانات
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [preferences, setPreferences] = useState<UiPreferences>(mockUiPreferences);
  const [notifications, setNotifications] = useState<NotificationPreferences>(mockNotificationPreferences);

  // حالات التحميل والرسائل التفاعلية
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // حفظ الملف الشخصي التجريبي
  const handleSaveProfile = async (data: { name: string; email: string }) => {
    setIsSaving(true);
    try {
      const updated = await updateProfileMock(data);
      setProfile(updated);
      setFeedback({
        type: "success",
        message: "تم تحديث بيانات الملف الشخصي بنجاح.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: "error",
        message: "حدث خطأ غير متوقع أثناء حفظ البيانات.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حفظ تفضيلات المظهر التجريبية
  const handleSavePreferences = async (newPrefs: UiPreferences) => {
    setIsSaving(true);
    try {
      const updated = await updateUiPreferencesMock(newPrefs);
      setPreferences(updated);
      setFeedback({
        type: "success",
        message: "تم حفظ وتطبيق تفضيلات المظهر بنجاح.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: "error",
        message: "تعذر تطبيق التفضيلات.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حفظ تفضيلات الإشعارات التجريبية
  const handleSaveNotifications = async (newNotifs: NotificationPreferences) => {
    setIsSaving(true);
    try {
      const updated = await updateNotificationPreferencesMock(newNotifs);
      setNotifications(updated);
      setFeedback({
        type: "success",
        message: "تم حفظ خيارات الإشعارات بنجاح.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: "error",
        message: "تعذر حفظ إعدادات الإشعارات.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // تسجيل الخروج الفعلي عبر Supabase Auth
  const handleConfirmLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await simulateLogoutMock();
      setIsLogoutModalOpen(false);
      await signOut();
    } catch {
      setFeedback({
        type: "error",
        message: "تعذر تسجيل الخروج من الجلسة.",
      });
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto w-full text-slate-800 dark:text-slate-100" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              الإعدادات العامة والتفضيلات المؤسسية
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Workspace Config
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            إدارة الملف الشخصي، تفضيلات العرض البصرية (Light / Dark)، الإشعارات، ومعايير الأمان المؤسسي
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setProfile(mockUserProfile);
            setPreferences(mockUiPreferences);
            setNotifications(mockNotificationPreferences);
            setFeedback({
              type: "info",
              message: "تمت استعادة الإعدادات الافتراضية.",
            });
            setTimeout(() => setFeedback(null), 3000);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>استعادة الافتراضي</span>
        </button>
      </div>

      {/* 2. شريط التغذية الراجعة التفاعلية (Feedback Toast) */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium backdrop-blur-xl animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
              : feedback.type === "error"
              ? "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20"
              : "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            {feedback.type === "error" && (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            {feedback.type === "info" && (
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. أشرطة التبويبات المنظمة الزجاجية */}
      <SettingsNavTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* 4. عرض محتوى التبويب النشط */}
      <div>
        {activeTab === "profile" && (
          <ProfileSection
            profile={profile}
            onSaveProfile={handleSaveProfile}
            isSaving={isSaving}
          />
        )}

        {activeTab === "preferences" && (
          <PreferencesSection
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
            isSaving={isSaving}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsSection
            notifications={notifications}
            onSaveNotifications={handleSaveNotifications}
            isSaving={isSaving}
          />
        )}

        {activeTab === "security_overview" && (
          <SecurityOverviewSection
            onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
          />
        )}
      </div>

      {/* 5. نافذة تأكيد تسجيل الخروج المنبثقة */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        isLoading={isLogoutLoading}
      />
    </div>
  );
}
