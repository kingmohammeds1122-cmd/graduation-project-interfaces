"use client";

import React from "react";
import {
  Database,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Server,
  FileSpreadsheet,
  Globe,
  Loader2,
} from "lucide-react";
import { DataSource, DataSourceStatus, DataSourceType } from "@/types/dataSources.types";

interface DataSourceTableProps {
  sources: DataSource[];
  onTestConnection: (source: DataSource) => void;
  onViewSchema: (source: DataSource) => void;
  onEdit: (source: DataSource) => void;
  onDelete: (source: DataSource) => void;
  testingSourceId: string | null;
}

export default function DataSourceTable({
  sources,
  onTestConnection,
  onViewSchema,
  onEdit,
  onDelete,
  testingSourceId,
}: DataSourceTableProps) {
  // شارات الحالة الثابتة بالألوان المعتمدة
  const renderStatusBadge = (status: DataSourceStatus) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>متصل ومعتمد</span>
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-spin" />
            <span>قيد المزامنة</span>
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>تنبيه / غير متاح</span>
          </span>
        );
      case "disconnected":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>غير متصل</span>
          </span>
        );
    }
  };

  // أيقونة النوع وشارة مميزة
  const renderTypeIcon = (type: DataSourceType) => {
    switch (type) {
      case "PostgreSQL":
      case "MySQL":
        return <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "REST API":
        return <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case "CSV / Excel":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "MongoDB":
      default:
        return <Database className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
    }
  };

  if (sources.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
          لا توجد مصادر تطابق معايير البحث
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر النوع والحالة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
      {/* عرض الجدول للشاشات المتوسطة والكبيرة */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold">
              <th className="p-4 whitespace-nowrap">المصدر ووصف المخطط</th>
              <th className="p-4 whitespace-nowrap">النوع</th>
              <th className="p-4 whitespace-nowrap">الحالة التشغيلية</th>
              <th className="p-4 whitespace-nowrap">آخر فحص وتحديث</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {sources.map((source) => {
              const isTesting = testingSourceId === source.id;
              return (
                <tr
                  key={source.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group"
                >
                  {/* الاسم والوصف */}
                  <td className="p-4 min-w-[220px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {source.name}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800">
                          {source.schema.length} جداول
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-1 text-[11px] leading-relaxed">
                        {source.description}
                      </p>
                    </div>
                  </td>

                  {/* النوع */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold font-mono">
                      {renderTypeIcon(source.type)}
                      <span>{source.type}</span>
                    </span>
                  </td>

                  {/* الحالة */}
                  <td className="p-4 whitespace-nowrap">
                    {renderStatusBadge(source.status)}
                  </td>

                  {/* آخر فحص */}
                  <td className="p-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{source.lastChecked}</span>
                    </div>
                  </td>

                  {/* الإجراءات */}
                  <td className="p-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* زر فحص الاتصال */}
                      <button
                        type="button"
                        onClick={() => onTestConnection(source)}
                        disabled={isTesting}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all disabled:opacity-60 cursor-pointer shadow-2xs"
                        title="اختبار الاتصال الآمن"
                      >
                        {isTesting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        )}
                        <span className="text-[11px]">فحص الاتصال</span>
                      </button>

                      {/* زر المخطط والتفاصيل */}
                      <button
                        type="button"
                        onClick={() => onViewSchema(source)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="عرض المخطط والجداول"
                        aria-label="عرض المخطط"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* زر التعديل */}
                      <button
                        type="button"
                        onClick={() => onEdit(source)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="تعديل المسمى والنوع"
                        aria-label="تعديل المصدر"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* زر الحذف */}
                      <button
                        type="button"
                        onClick={() => onDelete(source)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="حذف المصدر"
                        aria-label="حذف المصدر"
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

      {/* عرض بطاقات متجاوبة للشاشات الصغيرة والهواتف (Mobile Responsive Cards) */}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5">
        {sources.map((source) => {
          const isTesting = testingSourceId === source.id;
          return (
            <div key={source.id} className="p-4 space-y-3 text-right">
              {/* الترويسة ونوع المصدر والحالة */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{source.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {source.description}
                  </p>
                </div>
                {renderStatusBadge(source.status)}
              </div>

              {/* بيانات النوع وآخر فحص */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold font-mono">
                  {renderTypeIcon(source.type)}
                  <span>{source.type}</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{source.lastChecked}</span>
                </div>
              </div>

              {/* أزرار الإجراءات في الجوال */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onTestConnection(source)}
                  disabled={isTesting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  {isTesting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                  <span>فحص الاتصال</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewSchema(source)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                  aria-label="المخطط"
                  title="عرض المخطط"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(source)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                  aria-label="تعديل"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(source)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
