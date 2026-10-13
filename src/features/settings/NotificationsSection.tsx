"use client";

import React, { useState } from "react";
import {
  Mail,
  Database,
  CheckCircle2,
  Wrench,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import { NotificationPreferences } from "@/types/settings.types";

interface NotificationsSectionProps {
  notifications: NotificationPreferences;
  onSaveNotifications: (notifs: NotificationPreferences) => Promise<void>;
  isSaving: boolean;
}

export default function NotificationsSection({
  notifications,
  onSaveNotifications,
  isSaving,
}: NotificationsSectionProps) {
  const [emailReports, setEmailReports] = useState(notifications.emailReportsDigest);
  const [sourceSync, setSourceSync] = useState(notifications.sourceSyncAlerts);
  const [queryNotices, setQueryNotices] = useState(notifications.queryCompletionNotices);
  const [maintenance, setMaintenance] = useState(notifications.systemMaintenanceUpdates);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveNotifications({
      emailReportsDigest: emailReports,
      sourceSyncAlerts: sourceSync,
      queryCompletionNotices: queryNotices,
      systemMaintenanceUpdates: maintenance,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6"
    >
      {/* الترويسة */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          تفضيلات التنبيهات والإشعارات
        </h3>
        <p className="text-xs text-slate-500">
          تحديد قنوات وأنواع الإشعارات التي ترغب في تلقيها حول نشاط المنصة
        </p>
      </div>

      {/* قائمة التنبيهات */}
      <div className="space-y-4 text-xs">
        {/* 1. ملخص التقارير */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">ملخص التقارير الدورية بالبريد</span>
              <p className="text-slate-500 text-[11px]">
                تلقي إشعار بريدي أسبوعي يحتوي على ملخص المؤشرات والتقارير المكتملة.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailReports}
              onChange={(e) => setEmailReports(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* 2. تنبيهات فحص وتزامن مصادر البيانات */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">تنبيهات حالة مصادر البيانات</span>
              <p className="text-slate-500 text-[11px]">
                إشعار فوري عند انقطاع الاتصال بقاعدة بيانات أو تعثر مزامنة مستند.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sourceSync}
              onChange={(e) => setSourceSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* 3. اكتمال الاستفسارات التحليلية الطويلة */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">إشعار انتهاء معالجة الاستفسارات الكبيرة</span>
              <p className="text-slate-500 text-[11px]">
                تنبيه منبثق عند انتهاء توليد جداول المقارنة التي تتطلب معالجة مطولة.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={queryNotices}
              onChange={(e) => setQueryNotices(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* 4. إشعارات الصيانة */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">تحديثات الصيانة وترقية النماذج</span>
              <p className="text-slate-500 text-[11px]">
                إشعارات مسبقة بمواعيد الصيانة الدورية وتحديثات الأمان للنظام.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* التذييل والتنبيه */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>تغيير إعدادات الإشعارات تجريبي للمعاينة ولا يؤثر على خوادم البريد بعد.</span>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>جاري الحفظ التجريبي...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>حفظ خيارات الإشعارات تجريبياً</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
