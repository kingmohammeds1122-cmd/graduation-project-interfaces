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
  Cpu,
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
import GlowCard from "@/components/ui/GlowCard";

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
        message: `تمت إضافة الملف «${fileData.name}» وبدء خط أنابيب الفهرسة الشعاعية (RAG Vector Pipeline).`,
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
        message: `تمت إعادة إطلاق خط أنابيب الـ RAG للمستند «${doc.name}» بنجاح.`,
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
        message: "تم حذف المستند وإلغاء فهرسته الشعاعية بنجاح.",
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto w-full text-slate-800 dark:text-slate-100" dir="rtl">
      {/* 1. الترويسة الرئيسية مع شارة الشفافية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              المستندات وقاعدة المعرفة (RAG Knowledge Base)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Semantic Vector Index
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            فهرسة واسترجاع المعرفة المؤسسية غير المهيكلة عبر خط أنابيب RAG فائق الدقة (Zero-Trust Retrieval)
          </p>
        </div>

        <button
          type="button"
          onClick={reloadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>تحديث خط الأنابيب</span>
        </button>
      </div>

      {/* 2. بطاقات المؤشرات الإحصائية السريعة بـ GlowCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlowCard glowColor="blue">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">إجمالي المستندات</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {stats.total}
              </div>
              <span className="text-[11px] text-slate-400">ملفات معرفة مفهرسة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="emerald">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مكتمل الفهرسة (RAG)</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {stats.completed}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> جاهز للاسترجاع الفوري
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="amber">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">قيد المعالجة والتضمين</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {stats.processing}
              </div>
              <span className="text-[11px] text-slate-400">توليد الـ Chunks و Embeddings</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="rose">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">فشل المعالجة</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {stats.failed}
              </div>
              <span className="text-[11px] text-rose-500">يتطلب إعادة محاولة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 3. شريط الإشعار المنبثق التفاعلي */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium backdrop-blur-xl animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
              : notification.type === "error"
              ? "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20"
              : "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            {notification.type === "info" && (
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. منطقة رفع المستندات مع تأثير التوهج عند السحب */}
      <DocumentUploadArea
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
      />

      {/* 5. أدوات البحث والتصفية */}
      <DocumentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalCount={totalCount}
        filteredCount={documents.length}
      />

      {/* 6. عرض جدول المستندات أو حالات الخطأ والتحميل */}
      {isLoading ? (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            جاري تحديث فهارس المستندات وحالات المعالجة...
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center space-y-3 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</h4>
          <button
            type="button"
            onClick={reloadData}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
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

      {/* 7. نافذة التفاصيل المنبثقة */}
      <DocumentDetailsModal
        document={selectedDetailsDoc}
        onClose={() => setSelectedDetailsDoc(null)}
      />

      {/* 8. نافذة تأكيد الحذف المنبثقة */}
      <DocumentDeleteModal
        document={deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleteLoading}
      />

      {/* 9. شريط معلومات تقني عن خط أنابيب الـ RAG */}
      <div className="p-3.5 bg-slate-100/80 dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 text-[11px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            محرك التضمين: <strong>text-embedding-3-large (3072 dims)</strong> • نموذج التجزئة: <strong>Recursive Character Chunking (512 tokens / 50 overlap)</strong>
          </span>
        </div>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          Vector Cosine Similarity: 0.88+
        </span>
      </div>
    </div>
  );
}
