"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  LogOut,
  ArrowRight,
  UserCheck,
  Building2,
  Lock,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function PendingSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewlyRegistered = searchParams.get("registered") === "1";
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">جاري التحقق من جلسة Supabase Auth...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // إذا لم تكن هناك جلسة نشطة، يتم التوجيه إلى صفحة تسجيل الدخول
    router.push("/login");
    return null;
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      dir="rtl"
    >
      {/* تأثيرات الخلفية العصرية */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 my-8">
        {/* الترويسة العلوية */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            جلسة موثقة بنجاح عبر Supabase Auth
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isNewlyRegistered
              ? "تم إنشاء الحساب والمصادقة بنجاح"
              : "مرحباً بك، جلستك نشطة في مزود الهوية"}
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-lg mx-auto">
            تم التحقق من هويتك عبر Supabase. مرحلة ربط المؤسسة (Tenant) وإسناد الصلاحيات معلقة بانتظار اكتمال مسارات الـ Backend.
          </p>
        </div>

        {/* الكارد الرئيسي */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6 sm:p-8 space-y-6">

          {/* تنبيه حالة التسجيل الجديد */}
          {isNewlyRegistered && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3 text-xs leading-relaxed">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">تم تسجيل الحساب بنجاح:</span>
                تم حفظ بيانات اعتمادك في Supabase Auth. إعداد مساحة العمل والمؤسسة سيكتمل عند ربط خدمات FastAPI القادمة؛ لم يتم اختراع أي بيانات مؤسسة وهمية.
              </div>
            </div>
          )}

          {/* شبكة معلومات الحساب المؤكدة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* البريد الإلكتروني */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>البريد الإلكتروني المعتمد</span>
              </div>
              <div className="font-bold text-slate-900 text-sm truncate" dir="ltr">
                {user.email}
              </div>
            </div>

            {/* معرّف المستخدم الحقيقي في Supabase */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>معرّف المستخدم (Supabase UID)</span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 truncate" dir="ltr">
                {user.id}
              </div>
            </div>

            {/* حالة المؤسسة (Tenant) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-medium">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>المؤسسة والمستأجر (Tenant)</span>
              </div>
              <div className="font-bold text-amber-900">
                بانتظار عقود الـ Backend (FastAPI)
              </div>
            </div>

            {/* حالة العضوية والصلاحيات */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-medium">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>دور العضوية وسجل التدقيق</span>
              </div>
              <div className="font-bold text-amber-900">
                غير معين (محمي - يُدار عبر الخادم)
              </div>
            </div>
          </div>

          {/* صندوق التوضيح المعماري الشفاف */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">
                تنبيه الشفافية والمعمارية:
              </span>
              <p>
                تم عزل جلسة المصادقة الحقيقية عن منطق الأعمال. مسارات استعلام الملف الشخصي (<code className="font-mono text-[11px] text-slate-700">/api/v1/auth/me</code>) وإنشاء مساحات العمل وسجلات التدقيق (<code className="font-mono text-[11px] text-slate-700">audit_logs</code>) لا تزال قيد الإعداد في Backend.
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {/* زر معاينة واجهات المنصة التجريبية */}
            <Link
              href="/dashboard"
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm group"
            >
              <span>معاينة واجهات المنصة التجريبية (Mock)</span>
              <ArrowRight className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* زر تسجيل الخروج */}
            <button
              type="button"
              onClick={signOut}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* تذييل الصفحة */}
        <div className="mt-6 text-center text-xs text-slate-400">
          منصة ذكاء الأعمال والذكاء الاصطناعي • مرحلة Supabase Auth المستقلة
        </div>
      </div>
    </div>
  );
}

export default function PendingSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <PendingSetupContent />
    </Suspense>
  );
}
