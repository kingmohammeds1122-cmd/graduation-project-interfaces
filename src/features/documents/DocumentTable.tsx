"use client";

import React from "react";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Eye,
  Trash2,
  Loader2,
  Layers,
} from "lucide-react";
import { DocumentItem, DocumentStatus, DocumentFileType } from "@/types/documents.types";

interface DocumentTableProps {
  documents: DocumentItem[];
  onViewDetails: (doc: DocumentItem) => void;
  onRetry: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  retryingDocId: string | null;
}

export default function DocumentTable({
  documents,
  onViewDetails,
  onRetry,
  onDelete,
  retryingDocId,
}: DocumentTableProps) {
  // خط أنابيب معالجة الـ RAG المرئي الأنيق
  const renderRagPipelineStepper = (status: DocumentStatus) => {
    const isStep1Done = true; // Uploaded is always done
    const isStep2Done = status === "completed";
    const isStep2Active = status === "processing";
    const isStep3Done = status === "completed";
    const isFailed = status === "failed";

    return (
      <div className="flex items-center gap-1.5 text-[11px] font-mono">
        {/* المرحلة 1: الرفع */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            isStep1Done
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              : "bg-slate-100 dark:bg-white/5 text-slate-400"
          }`}
          title="مرحلة الاستلام والتحقق الأمني"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>1. Uploaded</span>
        </div>

        {/* خط الربط 1 */}
        <div className={`w-3 h-0.5 ${isStep2Done || isStep2Active ? "bg-blue-500" : "bg-slate-200 dark:bg-white/10"}`} />

        {/* المرحلة 2: التجزئة والتضمين (Chunking & Embeddings) */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            isStep2Done
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
              : isStep2Active
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse"
              : isFailed
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              : "bg-slate-100 dark:bg-white/5 text-slate-400"
          }`}
          title="مرحلة التجزئة وحساب المتجهات الشعاعية"
        >
          {isStep2Active ? (
            <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${isStep2Done ? "bg-purple-500" : isFailed ? "bg-rose-500" : "bg-slate-400"}`}></span>
          )}
          <span>2. Chunking</span>
        </div>

        {/* خط الربط 2 */}
        <div className={`w-3 h-0.5 ${isStep3Done ? "bg-emerald-500" : isFailed ? "bg-rose-500" : "bg-slate-200 dark:bg-white/10"}`} />

        {/* المرحلة 3: الفهرسة في قاعدة المتجهات (Vector Indexed) */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            isStep3Done
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs"
              : isFailed
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              : "bg-slate-100 dark:bg-white/5 text-slate-400"
          }`}
          title="مرحلة الجاهزية للبحث الدلالي RAG"
        >
          {isStep3Done ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : isFailed ? (
            <AlertCircle className="w-3 h-3 text-rose-500" />
          ) : (
            <Clock className="w-3 h-3 text-slate-400" />
          )}
          <span>{isStep3Done ? "3. Indexed" : isFailed ? "3. Failed" : "3. Pending"}</span>
        </div>
      </div>
    );
  };

  // أيقونة نوع الملف
  const renderFileIcon = (type: DocumentFileType) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case "DOCX":
        return <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "XLSX":
      case "CSV":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "TXT":
      default:
        return <FileCode className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
          لا توجد مستندات تطابق معايير البحث
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر الحالة والامتداد.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
      {/* جدول الحواسيب والشاشات الكبيرة */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold">
              <th className="p-4 whitespace-nowrap">اسم المستند والوصف</th>
              <th className="p-4 whitespace-nowrap">الامتداد</th>
              <th className="p-4 whitespace-nowrap">الحجم</th>
              <th className="p-4 whitespace-nowrap">تاريخ الرفع</th>
              <th className="p-4 whitespace-nowrap">خط أنابيب الـ RAG (Processing Pipeline)</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {documents.map((doc) => {
              const isRetrying = retryingDocId === doc.id;
              return (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group">
                  {/* اسم المستند */}
                  <td className="p-4 min-w-[220px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
                        {renderFileIcon(doc.type)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm block truncate">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                          {doc.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* النوع */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {doc.type}
                    </span>
                  </td>

                  {/* الحجم */}
                  <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium font-mono">
                    {doc.size}
                  </td>

                  {/* تاريخ الرفع */}
                  <td className="p-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium font-mono text-[11px]">
                    {doc.uploadedAt}
                  </td>

                  {/* خط أنابيب الـ RAG */}
                  <td className="p-4 whitespace-nowrap">
                    {renderRagPipelineStepper(doc.status)}
                  </td>

                  {/* الإجراءات */}
                  <td className="p-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* زر إعادة المحاولة في حالة الفشل */}
                      {doc.status === "failed" && (
                        <button
                          type="button"
                          onClick={() => onRetry(doc)}
                          disabled={isRetrying}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 font-semibold transition-all disabled:opacity-60 cursor-pointer text-[11px]"
                          title="إعادة محاولة المعالجة"
                        >
                          {isRetrying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                          <span>إعادة المحاولة</span>
                        </button>
                      )}

                      {/* زر التفاصيل */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(doc)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="تفاصيل المستند والميتاداتا"
                        aria-label="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* زر الحذف التجريبي */}
                      <button
                        type="button"
                        onClick={() => onDelete(doc)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="حذف المستند"
                        aria-label="حذف المستند"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* بطاقات متجاوبة للشاشات المتوسطة والصغيرة والهواتف */}
      <div className="xl:hidden divide-y divide-slate-100 dark:divide-white/5">
        {documents.map((doc) => {
          const isRetrying = retryingDocId === doc.id;
          return (
            <div key={doc.id} className="p-4 space-y-3 text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 mt-0.5">
                    {renderFileIcon(doc.type)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm block truncate">
                      {doc.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block truncate">
                      {doc.size} • {doc.uploadedAt}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  {doc.type}
                </span>
              </div>

              {/* خط أنابيب RAG في الجوال */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[280px]">
                  {renderRagPipelineStepper(doc.status)}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                {doc.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => onRetry(doc)}
                    disabled={isRetrying}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold"
                  >
                    {isRetrying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>إعادة المحاولة</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onViewDetails(doc)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  aria-label="عرض التفاصيل"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(doc)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  aria-label="حذف"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
