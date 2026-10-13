"use client";

import React, { useState } from "react";
import { X, Download, CheckCircle2, Info, Eye } from "lucide-react";
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
      `تم تسجيل طلب التنزيل التجريبي لصيغة «${report.format}» بنجاح (معاينة واجهة فقط • لا يتم تنزيل ملفات حقيقية).`
    );
    setTimeout(() => setDownloadFeedback(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* الترويسة */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-sm">
                معاينة وتصدير التقرير التجريبي
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                {report.title}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم المعاينة التفاعلية */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          {/* تنبيه صريح بالوظيفة التجريبية */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                تنبيه المعاينة والتنزيل التجريبي:
              </p>
              <p className="text-amber-700">
                لا يقوم هذا الزر بإنشاء أو تنزيل ملف فعلي إلى جهازك. ستُفعّل خاصية التصدير والتحميل المباشر بصيغ (PDF, Excel, CSV) بعد ربط الواجهة بنقاط نهاية الـ Backend.
              </p>
            </div>
          </div>

          {/* محاكاة صفحة التقرير المصغرة */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 font-sans">
            {/* ترويسة التقرير الرسمية */}
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center text-slate-500">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  منصة تحليلات الأعمال الذكية • نموذج تجريبي
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {report.title}
                </h4>
              </div>

              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                {report.format}
              </span>
            </div>

            {/* ملخص المحتوى الافتراضي */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">الملخص التنفيذي (Executive Summary):</span>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                {report.description} يستعرض هذا التقرير المؤشرات المجمعة وفقاً لنطاق ({report.details?.scope || "النطاق المحدد"}) مع الالتزام بمعايير الحوكمة والتحليل المتقدم.
              </p>
            </div>

            {/* بطاقات المؤشرات الافتراضية داخل التقرير */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">حالة التقرير</span>
                <span className="font-bold text-slate-800 text-xs">{report.statusLabel}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">الحجم التقديري</span>
                <span className="font-bold font-mono text-slate-800 text-xs">{report.size}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">تاريخ الإصدار</span>
                <span className="font-bold text-slate-800 text-xs truncate block">{report.createdAt}</span>
              </div>
            </div>
          </div>

          {/* رسالة التأكيد عند الضغط على التنزيل التجريبي */}
          {downloadFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadFeedback}</span>
            </div>
          )}
        </div>

        {/* التذييل وأزرار الإجراءات */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-400">
            الصيغة المحددة: <strong className="text-slate-700 font-mono">{report.format}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              إغلاق
            </button>

            <button
              type="button"
              onClick={handleSimulateDownload}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل تجريبي ({report.format})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
