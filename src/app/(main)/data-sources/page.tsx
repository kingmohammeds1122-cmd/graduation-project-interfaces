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
  Server,
  Layers,
  Cpu,
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
import GlowCard from "@/components/ui/GlowCard";

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

  // إحصائيات سريعة للبطاقات المتوهجة
  const connectedCount = sources.filter((s) => s.status === "connected").length;
  const totalTables = sources.reduce((acc, curr) => acc + (curr.schema?.length || 0), 0);

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
    <div className="space-y-6 max-w-7xl mx-auto w-full text-slate-800 dark:text-slate-100">
      {/* 1. الترويسة الرئيسية مع شارة الشفافية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              إدارة مصادر البيانات (Data Sources)
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Zero-Trust Metadata Discovery
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            ربط وإدارة مصادر قواعد البيانات العلائقية ومستودعات الميتاداتا المفهرسة لنواة الذكاء الاصطناعي
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold self-start sm:self-auto">
          <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>المصادر المتاحة: <strong className="text-blue-600 dark:text-blue-400 font-mono">{totalCount}</strong></span>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات المتوهجة بتقنية GlowCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard glowColor="blue">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">إجمالي المصادر النشطة</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{sources.length}</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> متصلة بالكامل
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="emerald">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">الاتصالات المعتمدة</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{connectedCount}</div>
              <span className="text-[11px] text-slate-400">جاهزة للاستعلام الفوري</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="purple">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">الجداول المفهرسة</span>
              <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{totalTables}</div>
              <span className="text-[11px] text-slate-400">مخططات جاهزة للـ Text2SQL</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="amber">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">معدل استجابة المخطط</span>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">42ms</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Realtime Latency</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 3. شريط التنبيهات والإشعارات التفاعلية */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs leading-relaxed transition-all shadow-md backdrop-blur-xl ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
              : notification.type === "error"
              ? "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20"
              : "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : notification.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 shrink-0 cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. شريط الفلاتر والبحث الزجاجي */}
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

      {/* 5. حالة الخطأ */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 sm:p-8 text-center space-y-3 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-rose-700 dark:text-rose-300">تعذر تحميل مصادر البيانات</h4>
          <p className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 max-w-md mx-auto">{error}</p>
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

      {/* 6. حالة التحميل */}
      {isLoading && (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            جاري قراءة مصادر البيانات وفهرسة المخططات...
          </p>
        </div>
      )}

      {/* 7. جدول وبطاقات مصادر البيانات الزجاجية */}
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

      {/* 8. النوافذ المنبثقة التفاعلية */}
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

      <DataSourceDetailsModal
        source={schemaModalSource}
        onClose={() => setSchemaModalSource(null)}
      />

      <DeleteConfirmModal
        source={deletingSource}
        onClose={() => setDeletingSource(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
