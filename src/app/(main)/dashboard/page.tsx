"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle,
  RotateCcw,
  Layers,
  CheckCircle2,
  Download,
  Loader2,
  SlidersHorizontal,
  Info,
  X,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { DashboardData } from "@/types/dashboard.types";
import { mockDashboardData } from "@/mocks/dashboard.mock";
import { getDashboardData } from "@/services/dashboard.service";

type ViewState = "normal" | "loading" | "error" | "empty";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(mockDashboardData);
  const [state, setState] = useState<ViewState>("normal");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDevTools, setShowDevTools] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleSwitchState = async (targetState: ViewState) => {
    setState("loading");
    setErrorMessage("");

    try {
      if (targetState === "error") {
        await getDashboardData({ simulateDelayMs: 350, forceError: true });
      } else if (targetState === "empty") {
        const result = await getDashboardData({ simulateDelayMs: 250, forceEmpty: true });
        setData(result);
        setState("empty");
      } else {
        const result = await getDashboardData({ simulateDelayMs: 250 });
        setData(result);
        setState("normal");
      }
    } catch (err: unknown) {
      setState("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("حدث خطأ غير متوقع أثناء معالجة البيانات التجريبية.");
      }
    }
  };

  const handleDownloadClick = (reportTitle: string) => {
    setDownloadNotice(
      `تنبيه المحاكاة: الملف (${reportTitle}) هو عينة توضيحية تجريبية. سيتم تفعيل التنزيل الفعلي لملفات PDF/Excel عند ربط الـ Backend لاحقاً.`
    );
  };

  return (
    <div className="space-y-5 md:space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. الترويسة الرئيسية الأنيقة مع شارة توضيحية صريحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              لوحة المؤشرات والتحليلات
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              بيانات محاكاة (Mock)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            مرحباً بك، أحمد • نموذج واجهة تفاعلية مصمم بالبيانات التجريبية المحلية
          </p>
        </div>

        {/* زر فتح أدوات التطوير المحلي (يظهر فقط في بيئة التطوير أثناء العمل المحلي) */}
        {process.env.NODE_ENV === "development" && (
          <button
            type="button"
            onClick={() => setShowDevTools(!showDevTools)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
            title="تبديل حالات الصفحة (متاح في بيئة التطوير فقط)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>أدوات الاختبار ({state})</span>
          </button>
        )}
      </div>

      {/* لوحة أدوات التطوير المنبثقة (متاحة في بيئة التطوير فقط) */}
      {process.env.NODE_ENV === "development" && showDevTools && (
        <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-bold text-white">لوحة اختبار حالات العرض (DevTools):</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              (هذه اللوحة لا تظهر للمستخدم العادي؛ مخصصة للمعاينة البرمجية السريعة)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSwitchState("normal")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                state === "normal"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              طبيعية
            </button>
            <button
              type="button"
              onClick={() => handleSwitchState("empty")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                state === "empty"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              فارغة
            </button>
            <button
              type="button"
              onClick={() => handleSwitchState("error")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                state === "error"
                  ? "bg-rose-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              خطأ
            </button>
            <button
              type="button"
              onClick={() => setShowDevTools(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 mr-1"
              aria-label="إغلاق لوحة الاختبار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* تنبيه شفاف عند النقر على تنزيل تجريبي */}
      {downloadNotice && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-2xl flex items-start justify-between gap-3 text-xs leading-relaxed shadow-2xs">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{downloadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="p-1 rounded-lg hover:bg-amber-100 text-amber-600 shrink-0"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. الإجراء الأساسي الموجه للمحادثة الذكية (Primary CTA to /chat) - متجاوب تماماً */}
      <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* لمسة لونية خفيفة على الحافة */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-600"></div>

        <div className="flex items-start gap-3 sm:gap-4 pr-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 text-violet-700 shadow-2xs">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                استشر مساعد الذكاء الاصطناعي
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 border border-violet-200">
                AI Assistant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              اطرح أسئلتك بلغة طبيعية لتحليل المستندات المرفوعة واستخراج الرؤى ومؤشرات الأداء فورياً وبدقة.
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/30 transition-all shrink-0 cursor-pointer text-center"
        >
          <span>بدء محادثة ذكية جديدة</span>
          <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
        </Link>
      </div>

      {/* 3. التعامل مع حالة الخطأ (Error State) */}
      {state === "error" && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-rose-900">تعذر تحميل بيانات اللوحة</h4>
          <p className="text-xs md:text-sm text-rose-700 max-w-md mx-auto">{errorMessage}</p>
          <button
            type="button"
            onClick={() => handleSwitchState("normal")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      )}

      {/* 4. التعامل مع حالة التحميل (Loading State) */}
      {state === "loading" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 animate-pulse"
              >
                <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
                <div className="h-7 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-md w-full"></div>
              </div>
            ))}
          </div>
          <div className="p-8 sm:p-12 text-center text-slate-400 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>جاري تجهيز المؤشرات التجريبية...</span>
          </div>
        </div>
      )}

      {/* 5. التعامل مع حالة البيانات الفارغة (Empty State) */}
      {state === "empty" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-800">لا توجد مؤشرات مسجلة حتى الآن</h4>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
            قم بربط مصادر البيانات أو رفع المستندات لبدء استعراض المؤشرات والتقارير الذكية.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSwitchState("normal")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              استعادة المؤشرات التجريبية
            </button>
          </div>
        </div>
      )}

      {/* 6. العرض الطبيعي للمؤشرات والنشاط (Normal State) */}
      {state === "normal" && data && (
        <>
          {/* شبكة بطاقات المؤشرات (Stat Cards Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.metrics.map((metric) => (
              <StatCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* قسمان متناسقان: النشاط الأخير والتقارير الأخيرة */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* أ. قائمة النشاط التجريبي الأخير (Recent Activities) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-900">النشاط الأخير بالمنصة</h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">سجل محاكاة</span>
                </div>

                <div className="space-y-3">
                  {data.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {act.title}
                          </span>
                          {act.status === "completed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              مكتمل
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              قيد المعالجة
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-normal line-clamp-1 break-words">
                          {act.description}
                        </p>
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 whitespace-nowrap self-start sm:self-center shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">
                  سجل استرشادي يوضح كيفية ظهور الإشعارات والعمليات عند الربط الفعلي
                </span>
              </div>
            </div>

            {/* ب. التقارير الأخيرة المتاحة (Recent Reports) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-900">أحدث التقارير المولدة</h4>
                  </div>
                  <Link
                    href="/reports"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    عرض الكل
                  </Link>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {data.recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3 sm:p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {report.title}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{report.category}</span>
                          <span>•</span>
                          <span>{report.fileSize}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        title="تنزيل تجريبي (محاكاة)"
                        onClick={() => handleDownloadClick(report.title)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                        aria-label={`تنزيل ${report.title}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px] sm:text-[11px]">نماذج تقارير توضيحية</span>
                <Link
                  href="/reports"
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>صفحة التقارير</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
