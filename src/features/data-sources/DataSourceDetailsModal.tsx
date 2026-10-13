"use client";

import React, { useState } from "react";
import { X, Table as TableIcon, Key, Info, Database } from "lucide-react";
import { DataSource } from "@/types/dataSources.types";

interface DataSourceDetailsModalProps {
  source: DataSource | null;
  onClose: () => void;
}

export default function DataSourceDetailsModal({
  source,
  onClose,
}: DataSourceDetailsModalProps) {
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  if (!source) return null;

  const currentTable = source.schema[selectedTableIndex] || source.schema[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        {/* 1. الترويسة العلوية */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                مخطط البيانات: {source.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                عينة مخطط محاكاة (Schema Mock)
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              استعراض تجريبي للجداول والحقول المستخرجة افتراضياً من المصدر ({source.type}).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. شريط التبويبات للجداول المحاكية */}
        <div className="bg-slate-50/80 px-5 sm:px-6 py-2.5 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap pl-2">
            الجداول المتاحة:
          </span>
          {source.schema.map((tbl, idx) => {
            const isActive = idx === selectedTableIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTableIndex(idx)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{tbl.tableName}</span>
                <span className="text-[10px] text-slate-400">
                  ({tbl.rowCountEstimate})
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. جسم النافذة: جدول الأعمدة والأنواع */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {currentTable ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold">
                  الحقول والأعمدة للجدول: {currentTable.tableName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentTable.columns.length} أعمدة معرفة
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/30">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">اسم العمود (Column)</th>
                      <th className="p-3">النوع (Type)</th>
                      <th className="p-3">الخصائص</th>
                      <th className="p-3">الوصف التوضيحي (محاكاة)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentTable.columns.map((col, cIdx) => (
                      <tr key={cIdx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {col.name}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {col.type}
                          </span>
                        </td>
                        <td className="p-3">
                          {col.isPrimary ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              <Key className="w-2.5 h-2.5" />
                              مفتاح رئيسي (PK)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 text-xs">
                          {col.description || "حقل بيانات قياسي"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              لا يتوفر مخطط افتراضي لهذا المصدر
            </div>
          )}

          {/* تنبيه شفافية الأمان */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              هذه الأسماء والأعمدة هي نموذج افتراضي لتجربة استعراض الـ Metadata والمخطط قبل الربط الفعلي بمحرك التحليلات.
            </span>
          </div>
        </div>

        {/* 4. التذييل السفلي */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400 text-[11px]">
            آخر فحص محاكى: {source.lastChecked}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
