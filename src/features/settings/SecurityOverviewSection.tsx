"use client";

import React from "react";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  UserCheck,
  LogOut,
  Info,
} from "lucide-react";

interface SecurityOverviewSectionProps {
  onOpenLogoutModal: () => void;
}

export default function SecurityOverviewSection({
  onOpenLogoutModal,
}: SecurityOverviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* 1. بطاقة السياسات الأمنية العامة */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              الأمان والسياسات المؤسسية (Security Overview)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            نظرة عامة على معايير حماية البيانات وسياسات مفاتيح الذكاء الاصطناعي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* بطاقة مفاتيح الذكاء الاصطناعي */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>مفاتيح الـ AI والأسرار</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              لا تُخزن أو تُعرض أي مفاتيح API أو بيانات اعتماد في متصفح العميل؛ حيث تُدار حصرياً عبر بيئة خادم الـ Backend المؤمنة.
            </p>
          </div>

          {/* بطاقة المصادقة والجلسات */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>المصادقة وتشفير النقل</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              تعتمد المنصة قنوات اتصال مشفرة (HTTPS/TLS) مع التوافق المستقبلي لنقاط الدخول الموحد (SSO/OAuth2).
            </p>
          </div>

          {/* بطاقة الصلاحيات للقراءة فقط */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>إدارة الصلاحيات والأدوار</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              تُدار الأدوار والصلاحيات مركزياً عبر المشرف الرئيسي لمساحة العمل ولا يمكن ترقيتها أو تعديلها ذاتياً.
            </p>
          </div>
        </div>

        {/* تنبيه الشفافية */}
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            تأكيد الامتثال الأمني: صُممت الواجهات وفق مبدأ الامتيازات الأقل (Least Privilege) لضمان عدم تسريب أي أسرار برمجية إلى كود الـ Frontend.
          </span>
        </div>
      </div>

      {/* 2. منطقة الجلسة وتسجيل الخروج التجريبي */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">
            جلسة العمل الحالية
          </h4>
          <p className="text-xs text-slate-500">
            تسجيل الخروج متاح كعنصر تجريبي لاختبار مسارات التنقل في النموذج
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogoutModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج تجريبي</span>
        </button>
      </div>
    </div>
  );
}
