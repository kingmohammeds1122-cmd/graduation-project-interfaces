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
  // شارة الحالة بالألوان الثابتة
  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>مكتمل</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>قيد المعالجة</span>
          </span>
        );
      case "uploaded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>مرفوع حديثاً</span>
          </span>
        );
      case "failed":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>فشل المعالجة</span>
          </span>
        );
    }
  };

  // أيقونة نوع الملف
  const renderFileIcon = (type: DocumentFileType) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "DOCX":
        return <File className="w-4 h-4 text-blue-600" />;
      case "XLSX":
      case "CSV":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case "TXT":
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800">
          لا توجد مستندات تطابق البحث
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر الحالة والامتداد.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* جدول الحواسيب والشاشات الكبيرة */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-4 whitespace-nowrap">اسم المستند</th>
              <th className="p-4 whitespace-nowrap">النوع</th>
              <th className="p-4 whitespace-nowrap">الحجم</th>
              <th className="p-4 whitespace-nowrap">تاريخ الرفع</th>
              <th className="p-4 whitespace-nowrap">حالة المعالجة</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات التجريبية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const isRetrying = retryingDocId === doc.id;
              return (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* اسم المستند */}
                  <td className="p-4 min-w-[240px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        {renderFileIcon(doc.type)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <span className="font-bold text-slate-900 text-sm block truncate">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {doc.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* النوع */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.type}
                    </span>
                  </td>

                  {/* الحجم */}
                  <td className="p-4 whitespace-nowrap text-slate-600 font-medium font-sans">
                    {doc.size}
                  </td>

                  {/* تاريخ الرفع */}
                  <td className="p-4 whitespace-nowrap text-slate-500 font-medium">
                    {doc.uploadedAt}
                  </td>

                  {/* حالة المعالجة */}
                  <td className="p-4 whitespace-nowrap">
                    {renderStatusBadge(doc.status)}
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
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-all disabled:opacity-60 cursor-pointer text-[11px]"
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
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="تفاصيل المستند"
                        aria-label="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* زر الحذف التجريبي */}
                      <button
                        type="button"
                        onClick={() => onDelete(doc)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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

      {/* بطاقات متجاوبة للهواتف والشاشات الصغيرة */}
      <div className="lg:hidden divide-y divide-slate-100">
        {documents.map((doc) => {
          const isRetrying = retryingDocId === doc.id;
          return (
            <div key={doc.id} className="p-4 space-y-3 text-right">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                    {renderFileIcon(doc.type)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="font-bold text-slate-900 text-sm block truncate">
                      {doc.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {doc.size} • {doc.uploadedAt}
                    </span>
                  </div>
                </div>

                {renderStatusBadge(doc.status)}
              </div>

              {/* أزرار الإجراءات في الجوال */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {doc.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => onRetry(doc)}
                    disabled={isRetrying}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold"
                  >
                    {isRetrying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>إعادة المعالجة</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onViewDetails(doc)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  aria-label="عرض التفاصيل"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(doc)}
                  className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50"
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
