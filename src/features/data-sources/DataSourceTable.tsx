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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>متصل تجريبياً</span>
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
            <span>قيد المزامنة</span>
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>تنبيه / غير متاح</span>
          </span>
        );
      case "disconnected":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
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
        return <Server className="w-4 h-4 text-blue-600" />;
      case "REST API":
        return <Globe className="w-4 h-4 text-cyan-600" />;
      case "CSV / Excel":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case "MongoDB":
      default:
        return <Database className="w-4 h-4 text-violet-600" />;
    }
  };

  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-800">
          لا توجد مصادر تطابق معايير البحث
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر النوع والحالة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* عرض الجدول للشاشات المتوسطة والكبيرة */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-4 whitespace-nowrap">المصدر والوصف</th>
              <th className="p-4 whitespace-nowrap">النوع</th>
              <th className="p-4 whitespace-nowrap">الحالة التجريبية</th>
              <th className="p-4 whitespace-nowrap">آخر فحص محاكى</th>
              <th className="p-4 whitespace-nowrap text-left">الإجراءات التجريبية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources.map((source) => {
              const isTesting = testingSourceId === source.id;
              return (
                <tr
                  key={source.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* الاسم والوصف */}
                  <td className="p-4 min-w-[220px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {source.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Mock)
                        </span>
                      </div>
                      <p className="text-slate-500 line-clamp-1 text-[11px] leading-relaxed">
                        {source.description}
                      </p>
                    </div>
                  </td>

                  {/* النوع */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/70 border border-slate-200 text-slate-800 font-semibold">
                      {renderTypeIcon(source.type)}
                      <span>{source.type}</span>
                    </span>
                  </td>

                  {/* الحالة */}
                  <td className="p-4 whitespace-nowrap">
                    {renderStatusBadge(source.status)}
                  </td>

                  {/* آخر فحص */}
                  <td className="p-4 whitespace-nowrap text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{source.lastChecked}</span>
                    </div>
                  </td>

                  {/* الإجراءات */}
                  <td className="p-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* زر فحص الاتصال التجريبي */}
                      <button
                        type="button"
                        onClick={() => onTestConnection(source)}
                        disabled={isTesting}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-semibold transition-all disabled:opacity-60 cursor-pointer shadow-2xs"
                        title="اختبار الاتصال التجريبي"
                      >
                        {isTesting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span className="text-[11px]">فحص الاتصال</span>
                      </button>

                      {/* زر المخطط والتفاصيل */}
                      <button
                        type="button"
                        onClick={() => onViewSchema(source)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="عرض المخطط والجداول"
                        aria-label="عرض المخطط"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* زر التعديل */}
                      <button
                        type="button"
                        onClick={() => onEdit(source)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="تعديل المسمى والنوع"
                        aria-label="تعديل المصدر"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* زر الحذف */}
                      <button
                        type="button"
                        onClick={() => onDelete(source)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
      <div className="lg:hidden divide-y divide-slate-100">
        {sources.map((source) => {
          const isTesting = testingSourceId === source.id;
          return (
            <div key={source.id} className="p-4 space-y-3 text-right">
              {/* الترويسة ونوع المصدر والحالة */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">{source.name}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {source.description}
                  </p>
                </div>
                {renderStatusBadge(source.status)}
              </div>

              {/* بيانات النوع وآخر فحص */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {renderTypeIcon(source.type)}
                  <span>{source.type}</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{source.lastChecked}</span>
                </div>
              </div>

              {/* أزرار الإجراءات في الجوال */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onTestConnection(source)}
                  disabled={isTesting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  {isTesting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>فحص الاتصال</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewSchema(source)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  aria-label="المخطط"
                  title="عرض المخطط"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(source)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  aria-label="تعديل"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(source)}
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
