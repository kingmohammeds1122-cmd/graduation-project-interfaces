"use client";

import React, { useState } from "react";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Loader2,
  Info,
  X,
} from "lucide-react";
import {
  DataSource,
  DataSourceFilterOptions,
  DataSourceType,
} from "@/types/dataSources.types";
import { mockDataSources } from "@/mocks/dataSources.mock";
import {
  getDataSources,
  testConnectionMock,
  createMockDataSource,
  updateMockDataSource,
  deleteMockDataSource,
} from "@/services/dataSources.service";
import DataSourceFilters from "@/features/data-sources/DataSourceFilters";
import DataSourceTable from "@/features/data-sources/DataSourceTable";
import DataSourceModal from "@/features/data-sources/DataSourceModal";
import DataSourceDetailsModal from "@/features/data-sources/DataSourceDetailsModal";
import DeleteConfirmModal from "@/features/data-sources/DeleteConfirmModal";

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>(mockDataSources);
  const [totalCount, setTotalCount] = useState<number>(mockDataSources.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // الفلاتر
  const [filters, setFilters] = useState<DataSourceFilterOptions>({
    searchQuery: "",
    typeFilter: "all",
    statusFilter: "all",
  });

  // النوافذ المنبثقة
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [schemaModalSource, setSchemaModalSource] = useState<DataSource | null>(null);
  const [deletingSource, setDeletingSource] = useState<DataSource | null>(null);

  // حالات العمليات المساعدة
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  // دالة تصفية وتحديث البيانات بناءً على التفاعل
  const handleFilterChange = async (newFilters: DataSourceFilterOptions) => {
    setFilters(newFilters);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDataSources(newFilters, { delayMs: 150 });
      setSources(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تصفية مصادر البيانات التجريبية.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reloadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDataSources(filters, { delayMs: 150 });
      setSources(data);
      const allData = await getDataSources(undefined, { delayMs: 0 });
      setTotalCount(allData.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر تحميل مصادر البيانات.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار الاتصال التجريبي
  const handleTestConnection = async (source: DataSource) => {
    setTestingSourceId(source.id);
    try {
      const result = await testConnectionMock(source.id);
      setNotification({
        type: result.success ? "success" : "error",
        message: result.message,
      });
      // تحديث وقت الفحص محلياً
      setSources((prev) =>
        prev.map((s) =>
          s.id === source.id ? { ...s, lastChecked: result.timestamp } : s
        )
      );
    } catch {
      setNotification({
        type: "error",
        message: "حدث خطأ غير متوقع أثناء فحص الاتصال التجريبي.",
      });
    } finally {
      setTestingSourceId(null);
    }
  };

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setEditingSource(null);
    setIsFormModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (source: DataSource) => {
    setEditingSource(source);
    setIsFormModalOpen(true);
  };

  // إرسال نموذج الإضافة / التعديل
  const handleFormSubmit = async (formData: {
    name: string;
    type: DataSourceType;
    description: string;
  }) => {
    setIsActionLoading(true);
    try {
      if (editingSource) {
        await updateMockDataSource(editingSource.id, formData);
        setNotification({
          type: "success",
          message: `تم تعديل بيانات المصدر التجريبي «${formData.name}» بنجاح (محاكاة).`,
        });
      } else {
        await createMockDataSource(formData);
        setNotification({
          type: "success",
          message: `تمت إضافة المصدر التجريبي «${formData.name}» بنجاح (محاكاة).`,
        });
      }
      setIsFormModalOpen(false);
      setEditingSource(null);
      await reloadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotification({ type: "error", message: err.message });
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  // تأكيد الحذف
  const handleConfirmDelete = async (sourceId: string) => {
    setIsActionLoading(true);
    try {
      await deleteMockDataSource(sourceId);
      setNotification({
        type: "info",
        message: "تم حذف المصدر التجريبي من القائمة المحلية (محاكاة).",
      });
      setDeletingSource(null);
      await reloadData();
    } catch {
      setNotification({
        type: "error",
        message: "تعذر حذف المصدر التجريبي.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-5 md:space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. الترويسة الرئيسية مع شارة الشفافية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              إدارة مصادر البيانات (Data Sources)
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              بيانات ومخططات محاكاة (Mock)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            استعراض وفحص مصادر البيانات وقواعد البيانات التجريبية بدون اتصال فعلي بالخادم
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold self-start sm:self-auto">
          <Database className="w-4 h-4 text-blue-600" />
          <span>المصادر المعرفة: {totalCount}</span>
        </div>
      </div>

      {/* 2. شريط التنبيهات والإشعارات التفاعلية */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs leading-relaxed transition-all shadow-2xs ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : notification.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <div className="flex items-start gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : notification.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 shrink-0"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. شريط الفلاتر والبحث */}
      <DataSourceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onAddNewClick={handleOpenAdd}
        onResetFilters={() =>
          handleFilterChange({ searchQuery: "", typeFilter: "all", statusFilter: "all" })
        }
        totalCount={totalCount}
        filteredCount={sources.length}
      />

      {/* 4. حالة الخطأ */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-rose-900">تعذر تحميل مصادر البيانات</h4>
          <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={reloadData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      )}

      {/* 5. حالة التحميل */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            جاري قراءة مصادر البيانات التجريبية...
          </p>
        </div>
      )}

      {/* 6. جدول وبطاقات مصادر البيانات */}
      {!isLoading && !error && (
        <DataSourceTable
          sources={sources}
          onTestConnection={handleTestConnection}
          onViewSchema={(src) => setSchemaModalSource(src)}
          onEdit={handleOpenEdit}
          onDelete={(src) => setDeletingSource(src)}
          testingSourceId={testingSourceId}
        />
      )}

      {/* 7. النوافذ المنبثقة التفاعلية */}
      {/* نافذة الإضافة والتعديل مع key لضمان إعادة ضبط الحالة */}
      <DataSourceModal
        key={editingSource ? editingSource.id : "new-source"}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSource(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSource}
        isLoading={isActionLoading}
      />

      {/* نافذة استعراض المخطط والجداول المحاكية */}
      <DataSourceDetailsModal
        source={schemaModalSource}
        onClose={() => setSchemaModalSource(null)}
      />

      {/* نافذة تأكيد الحذف التجريبي */}
      <DeleteConfirmModal
        source={deletingSource}
        onClose={() => setDeletingSource(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
