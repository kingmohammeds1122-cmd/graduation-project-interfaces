"use client";

import React, { useState } from "react";
import { X, Download, CheckCircle2, Eye, ShieldCheck, FileText, Printer } from "lucide-react";
import { ReportItem } from "@/types/reports.types";

interface ReportPreviewModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function ReportPreviewModal({
  report,
  onClose,
}: ReportPreviewModalProps) {
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  if (!report) return null;

  const handleSimulateDownload = () => {
    setDownloadFeedback(
      `تم تصدير وتنزيل ملف التقرير «${report.title}.${report.format.toLowerCase()}» بنجاح مع ختم التحقق الرقمي.`
    );
    setTimeout(() => setDownloadFeedback(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl w-full max-w-3xl overflow-hidden text-right flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100">
        
        {/* 1. الترويسة المؤسسية الزجاجية */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-sm">
                  معاينة وتصدير التقرير
                </h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {report.format}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                {report.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer hidden sm:flex"
              title="طباعة التقرير"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. جسم المعاينة التفاعلية */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          {/* محاكاة صفحة التقرير المصغرة الفاخرة */}
          <div className="bg-slate-50/80 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 font-sans shadow-inner">
            
            {/* ترويسة التقرير الرسمية */}
            <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest block font-bold">
                  Enterprise Analytics & AI Core Intelligence
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {report.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold shadow-2xs">
                  {report.format} • {report.size}
                </span>
              </div>
            </div>

            {/* بطاقات المؤشرات الافتراضية داخل التقرير */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <span className="text-[10px] text-slate-400 block mb-1">حالة الاعتماد</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {report.statusLabel}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <span className="text-[10px] text-slate-400 block mb-1">التصنيف الوظيفي</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{report.categoryLabel}</span>
              </div>

              <div className="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <span className="text-[10px] text-slate-400 block mb-1">تاريخ الإصدار</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200 text-xs truncate block">{report.createdAt}</span>
              </div>

              <div className="bg-white/80 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <span className="text-[10px] text-slate-400 block mb-1">المحرك المنشئ</span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400 text-xs">AI Planner v2</span>
              </div>
            </div>

            {/* ملخص المحتوى الافتراضي */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">الملخص التنفيذي وتوصيات الذكاء الاصطناعي (Executive Summary):</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white/90 dark:bg-white/[0.03] p-4 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs">
                {report.description} يغطي هذا التقرير تحليلات معمقة لمؤشرات الأداء وفقاً لنطاق ({report.details?.scope || "النطاق المؤسسي المعتمد"})، مع فحص التغيرات الدورية واستخراج الأنماط الإحصائية لتعزيز كفاءة اتخاذ القرارات.
              </p>
            </div>

            {/* جدول بيانات المعاينة التقريبي */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">عينة من السجلات والبيانات المحللة:</span>
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/10">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                      <th className="p-2.5">المؤشر الرئيسي</th>
                      <th className="p-2.5">القيمة المقاسة</th>
                      <th className="p-2.5">معدل النمو</th>
                      <th className="p-2.5">درجة الموثوقية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/60 dark:bg-white/[0.01]">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">إجمالي العمليات المعتمدة</td>
                      <td className="p-2.5 font-mono">1,482,900</td>
                      <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">+14.2%</td>
                      <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400">99.8%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">متوسط زمن الاستجابة</td>
                      <td className="p-2.5 font-mono">38 ms</td>
                      <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">-12.5%</td>
                      <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400">100%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">نسبة الامتثال للسياسات</td>
                      <td className="p-2.5 font-mono">100%</td>
                      <td className="p-2.5 font-mono text-slate-400">0.0%</td>
                      <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* تنبيه الأمان والختم المشفر */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-700 dark:text-slate-300 text-[11px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                تقرير موقع ومؤمن رقمياً بواسطة مفتاح التحقق المؤسسي (SHA-256 Checksum: Verified).
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 font-mono text-slate-400 text-[10px]">
              <FileText className="w-3 h-3" />
              <span>Audit ID: 8849-AC</span>
            </div>
          </div>

          {/* رسالة التأكيد عند الضغط على التنزيل */}
          {downloadFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{downloadFeedback}</span>
            </div>
          )}
        </div>

        {/* 3. التذييل وأزرار الإجراءات */}
        <div className="p-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            الصيغة المعتمدة للتصدير: <strong className="text-blue-600 dark:text-blue-400">{report.format}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              إغلاق
            </button>

            <button
              type="button"
              onClick={handleSimulateDownload}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير وتحميل ({report.format})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
