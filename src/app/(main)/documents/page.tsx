"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Loader2,
  Info,
  X,
  FileCheck,
} from "lucide-react";
import {
  DocumentItem,
  DocumentFilterOptions,
  DocumentFileType,
} from "@/types/documents.types";
import { mockDocuments } from "@/mocks/documents.mock";
import {
  getDocuments,
  addMockDocument,
  retryProcessingMock,
  deleteMockDocument,
} from "@/services/documents.service";
import DocumentUploadArea from "@/features/documents/DocumentUploadArea";
import DocumentFilters from "@/features/documents/DocumentFilters";
import DocumentTable from "@/features/documents/DocumentTable";
import DocumentDetailsModal from "@/features/documents/DocumentDetailsModal";
import DocumentDeleteModal from "@/features/documents/DocumentDeleteModal";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [totalCount, setTotalCount] = useState<number>(mockDocuments.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // الفلاتر
  const [filters, setFilters] = useState<DocumentFilterOptions>({
    searchQuery: "",
    statusFilter: "all",
    typeFilter: "all",
  });

  // النوافذ المنبثقة
  const [selectedDetailsDoc, setSelectedDetailsDoc] = useState<DocumentItem | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<DocumentItem | null>(null);

  // حالات العمليات التفاعلية
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [retryingDocId, setRetryingDocId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  // الإحصائيات السريعة المحسوبة محلياً
  const stats = {
    total: totalCount,
    completed: documents.filter((d) => d.status === "completed").length,
    processing: documents.filter((d) => d.status === "processing" || d.status === "uploaded").length,
    failed: documents.filter((d) => d.status === "failed").length,
  };

  // معالجة تغيير الفلاتر
  const handleFilterChange = async (newFilters: DocumentFilterOptions) => {
    setFilters(newFilters);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocuments(newFilters, { delayMs: 150 });
      setDocuments(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تصفية المستندات التجريبية.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = async () => {
    const emptyFilters: DocumentFilterOptions = {
      searchQuery: "",
      statusFilter: "all",
      typeFilter: "all",
    };
    setFilters(emptyFilters);
    await handleFilterChange(emptyFilters);
  };

  // إعادة تحميل البيانات
  const reloadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocuments(filters, { delayMs: 200 });
      setDocuments(data);
      const allData = await getDocuments(undefined, { delayMs: 0 });
      setTotalCount(allData.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تحميل المستندات.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // رفع ملف محلي للعرض التجريبي
  const handleFileUpload = async (fileData: {
    name: string;
    size: string;
    type: DocumentFileType;
  }) => {
    setIsUploading(true);
    try {
      const newDoc = await addMockDocument(fileData);
      setDocuments((prev) => [newDoc, ...prev]);
      setTotalCount((prev) => prev + 1);
      setNotification({
        type: "success",
        message: `تمت إضافة الملف التجريبي «${fileData.name}» للمعاينة بنجاح (محاكاة).`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setNotification({
        type: "error",
        message: "حدث خطأ أثناء إضافة الملف التجريبي.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // إعادة محاولة المعالجة
  const handleRetryProcessing = async (doc: DocumentItem) => {
    setRetryingDocId(doc.id);
    try {
      const updated = await retryProcessingMock(doc.id);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setNotification({
        type: "success",
        message: `تمت محاكاة إعادة معالجة المستند «${doc.name}» بنجاح.`,
      });
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({
        type: "error",
        message: `تعذرت إعادة محاولة معالجة «${doc.name}».`,
      });
    } finally {
      setRetryingDocId(null);
    }
  };

  // تأكيد الحذف التجريبي
  const handleConfirmDelete = async (docId: string) => {
    setIsDeleteLoading(true);
    try {
      await deleteMockDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeletingDoc(null);
      setNotification({
        type: "info",
        message: "تم حذف المستند التجريبي من القائمة بنجاح.",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setNotification({
        type: "error",
        message: "تعذر حذف المستند.",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              المستندات وقاعدة المعرفة
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              عرض تجريبي
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            فهرسة واستعراض ملفات المعرفة الداعمة لمحرك البحث والذكاء الاصطناعي
          </p>
        </div>

        <button
          type="button"
          onClick={reloadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 text-slate-500 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* 2. تنبيه الشفافية والمحاكاة التجريبية الصريح */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-800 leading-relaxed">
          <p className="font-bold">
            تنبيه الشفافية: كافة الملفات والعمليات هنا هي محاكاة بصرية تجريبية (Mock Demonstration).
          </p>
          <p className="text-amber-700 text-[11px]">
            لا يتم رفع أو تخزين أي ملفات على خوادم، ولا تُنفذ عمليات المعالجة اللغوية أو التقسيم (Chunking) أو التضمين الشعاعي (Embeddings/Vector Search) داخل تطبيق React. سيتم ربط هذه العمليات لاحقاً بنقاط نهاية الـ Backend المخصصة.
          </p>
        </div>
      </div>

      {/* 3. شريط الإشعار المنبثق التفاعلي */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-medium animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : notification.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            {notification.type === "info" && (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. بطاقات المؤشرات الإحصائية السريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">إجمالي المستندات</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            {stats.total}
          </div>
          <span className="text-[10px] text-slate-400">ملفات مسجلة تجريبياً</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">مكتمل الفهرسة</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-sans">
            {stats.completed}
          </div>
          <span className="text-[10px] text-slate-400">جاهز للاستفسار (محاكاة)</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">قيد المعالجة</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 font-sans">
            {stats.processing}
          </div>
          <span className="text-[10px] text-slate-400">بانتظار الفهرسة الافتراضية</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">فشل المعالجة</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 font-sans">
            {stats.failed}
          </div>
          <span className="text-[10px] text-slate-400">يتطلب إعادة محاولة</span>
        </div>
      </div>

      {/* 5. منطقة رفع المستندات التجريبية */}
      <DocumentUploadArea
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
      />

      {/* 6. أدوات البحث والتصفية */}
      <DocumentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalCount={totalCount}
        filteredCount={documents.length}
      />

      {/* 7. عرض البيانات أو حالات الخطأ والتحميل */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            جاري تحديث قائمة المستندات التجريبية...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">{error}</h4>
          <button
            type="button"
            onClick={reloadData}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <DocumentTable
          documents={documents}
          onViewDetails={(doc) => setSelectedDetailsDoc(doc)}
          onRetry={handleRetryProcessing}
          onDelete={(doc) => setDeletingDoc(doc)}
          retryingDocId={retryingDocId}
        />
      )}

      {/* 8. نافذة التفاصيل المنبثقة */}
      <DocumentDetailsModal
        document={selectedDetailsDoc}
        onClose={() => setSelectedDetailsDoc(null)}
      />

      {/* 9. نافذة تأكيد الحذف المنبثقة */}
      <DocumentDeleteModal
        document={deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleteLoading}
      />

      {/* 10. أدوات المطور للمعاينة التجريبية (بيئة التطوير فقط) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>أدوات فحص واجهة المستندات (تظهر في بيئة التطوير فقط):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة التحميل
            </button>
            <button
              type="button"
              onClick={() => setError("عينة خطأ افتراضي لمعاينة سلوك الشاشة")}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              محاكاة خطأ
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setDocuments(mockDocuments);
                setTotalCount(mockDocuments.length);
              }}
              className="px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              استعادة العينات الأصلية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
