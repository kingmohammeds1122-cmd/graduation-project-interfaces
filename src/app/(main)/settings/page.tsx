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

export default function SettingsPage() {
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
        message: "تم تحديث بيانات الملف الشخصي محلياً بنجاح (محاكاة العرض التجريبي • لم تُحفظ على أي خادم).",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: "error",
        message: "حدث خطأ غير متوقع أثناء المعاينة.",
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
        message: "تم تطبيق تفضيلات المظهر محلياً بنجاح (معاينة واجهة فقط).",
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
        message: "تم حفظ خيارات الإشعارات محلياً بنجاح (محاكاة تجريبية).",
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

  // محاكاة تسجيل الخروج
  const handleConfirmLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await simulateLogoutMock();
      setIsLogoutModalOpen(false);
      setFeedback({
        type: "info",
        message: "تمت محاكاة تسجيل الخروج بنجاح (تنبيه: لا توجد جلسة خادم حقيقية يتم إنهاؤها).",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: "error",
        message: "تعذرت محاكاة تسجيل الخروج.",
      });
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              الإعدادات العامة والتفضيلات
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              تفضيلات محلية
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            إدارة الملف الشخصي، تفضيلات العرض البصرية، والإشعارات (معاينة تجريبية معزولة)
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
              message: "تمت استعادة الإعدادات الافتراضية للنموذج.",
            });
            setTimeout(() => setFeedback(null), 3000);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>استعادة الافتراضي</span>
        </button>
      </div>

      {/* 2. شريط تنبيه الشفافية والمحاكاة الصريح */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-800 leading-relaxed">
          <p className="font-bold">
            تنبيه الشفافية: كافة الإعدادات والبيانات الظاهرة هنا هي معاينة بصرية تجريبية (Mock Settings).
          </p>
          <p className="text-amber-700 text-[11px]">
            لا يتم إرسال أو حفظ أي تغييرات على خادم، ولا تشتمل هذه الواجهة على أي مفاتيح API أو كلمات مرور أو أسرار برمجية. سيتم ربط التفضيلات بقاعدة البيانات لاحقاً بعد تفعيل خدمات الـ Backend.
          </p>
        </div>
      </div>

      {/* 3. شريط التغذية الراجعة التفاعلية (Feedback Toast) */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-medium animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : feedback.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            {feedback.type === "error" && (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            {feedback.type === "info" && (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. أشرطة التبويبات المنظمة */}
      <SettingsNavTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* 5. عرض محتوى التبويب النشط */}
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

      {/* 6. نافذة تأكيد تسجيل الخروج التجريبي المنبثقة */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        isLoading={isLogoutLoading}
      />

      {/* 7. أدوات فحص المطور (تظهر في بيئة التطوير فقط) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>أدوات فحص واجهة الإعدادات (بيئة التطوير فقط):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFeedback({
                  type: "error",
                  message: "عينة خطأ تجريبي لفحص طريقة عرض التنبيهات في الواجهة.",
                });
              }}
              className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة خطأ
            </button>
            <button
              type="button"
              onClick={() => {
                setFeedback({
                  type: "success",
                  message: "عينة نجاح تجريبي لمعاينة التغذية الراجعة.",
                });
              }}
              className="px-2 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة نجاح
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
