"use client";

import React, { useState } from "react";
import { X, Table as TableIcon, Key, Info, Database, Cpu, ShieldCheck, Hash, Layers } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-right text-slate-800 dark:text-slate-100">
        
        {/* 1. الترويسة العلوية التكنولوجية */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-start justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                مستكشف المخطط البياني: {source.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                {source.type}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                مفهرس ومتزامن
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              استكشاف الجداول، الحقول، المفاتيح الأساسية والأجنبية المستخرجة آلياً عبر محرك الفهرسة الدلالية.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. شريط التنبيه التقني الصريح: المعالجة عبر Backend & AI Core */}
        <div className="mx-5 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20 dark:border-blue-400/20 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700 dark:text-blue-300">
                اكتشاف المخطط البياني الذاتي (Automated Schema Discovery):
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                AI Core & Backend Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              تتم قراءة البنية الهيكلية وحفظ الميتاداتا مشفرة في طبقة الـ Vector Index دون تحميل أو نسخ البيانات الحساسة لضمان سيادة البيانات التامة (Data Sovereign Zero-Trust).
            </p>
          </div>
        </div>

        {/* 3. شريط التبويبات للجداول المكتشفة */}
        <div className="bg-slate-50/70 dark:bg-white/[0.02] px-5 sm:px-6 py-3 border-y border-slate-200/70 dark:border-white/10 flex items-center gap-2 overflow-x-auto shrink-0 mt-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap pl-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            الجداول المفهرسة ({source.schema.length}):
          </span>
          {source.schema.map((tbl, idx) => {
            const isActive = idx === selectedTableIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTableIndex(idx)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-mono ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500"
                    : "bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10"
                }`}
              >
                <TableIcon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-blue-500"}`} />
                <span>{tbl.tableName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                }`}>
                  {tbl.rowCountEstimate}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. جسم النافذة: جدول الأعمدة والأنواع بتصميم تقني فخم بخط JetBrains Mono */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {currentTable ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-500" />
                  حقول ومحددات الجدول: <code className="font-mono text-blue-600 dark:text-blue-400 font-bold">{currentTable.tableName}</code>
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {currentTable.columns.length} أعمدة معرفة
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/30 dark:bg-black/20 shadow-inner">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-white/10">
                      <th className="p-3 text-right">العمود (Field Name)</th>
                      <th className="p-3 text-right">نوع البيانات (Data Type)</th>
                      <th className="p-3 text-right">المفتاح والقيود (Constraints)</th>
                      <th className="p-3 text-right">الوصف الدلالي للمساعد الذكي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/70 dark:bg-white/[0.01]">
                    {currentTable.columns.map((col, cIdx) => {
                      const isForeignKey = !col.isPrimary && (col.name.endsWith("_id") || col.name.startsWith("id_") || col.name.includes("fk"));
                      return (
                        <tr key={cIdx} className="hover:bg-blue-50/50 dark:hover:bg-white/[0.03] transition-colors group">
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></span>
                            {col.name}
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-blue-700 dark:text-cyan-400 border border-slate-200 dark:border-white/10">
                              {col.type}
                            </span>
                          </td>
                          <td className="p-3">
                            {col.isPrimary ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
                                <Key className="w-3 h-3" />
                                PK (Primary Key)
                              </span>
                            ) : isForeignKey ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-xs">
                                <Key className="w-3 h-3 rotate-45" />
                                FK (Foreign Key)
                              </span>
                            ) : (
                              <span className="font-mono text-slate-400 text-[11px] px-2 py-0.5 rounded bg-transparent">
                                NULLABLE
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 text-xs">
                            {col.description || "حقل ميتاداتا مستخرج آلياً وجاهز للاستعلام بـ Natural Language to SQL."}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
              لا يتوفر مخطط افتراضي لهذا المصدر حالياً
            </div>
          )}

          {/* تنبيه تكامل RAG ومحددات الوصول */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 text-[11px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                محمي بميزة <strong>Field-Level Masking</strong>: البيانات الحقيقية والرموز السرية لا تظهر في الاستعلامات إلا بصلاحيات معتمدة.
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <Info className="w-3 h-3" />
              <span>Schema v2.4</span>
            </div>
          </div>
        </div>

        {/* 5. التذييل السفلي */}
        <div className="p-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
            <span>آخر فحص ومزامنة:</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{source.lastChecked}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold transition-all cursor-pointer shadow-xs"
          >
            إغلاق المخطط
          </button>
        </div>
      </div>
    </div>
  );
}
