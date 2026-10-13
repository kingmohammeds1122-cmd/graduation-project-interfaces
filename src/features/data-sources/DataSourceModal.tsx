"use client";

import React, { useState } from "react";
import { X, ShieldAlert, Server, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { DataSource, DataSourceType } from "@/types/dataSources.types";
import { DATA_SOURCE_TYPES } from "./DataSourceFilters";

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: DataSourceType; description: string }) => void;
  initialData?: DataSource | null;
  isLoading: boolean;
}

export default function DataSourceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: DataSourceModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<DataSourceType>(initialData?.type || "PostgreSQL");
  const [description, setDescription] = useState(initialData?.description || "");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success">("idle");

  const isEditMode = Boolean(initialData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      type,
      description: description.trim(),
    });
  };

  const handleSimulateTest = async () => {
    setTestStatus("testing");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTestStatus("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-right">
        {/* 1. الترويسة */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isEditMode ? "تعديل مصدر البيانات التجريبي" : "إضافة مصدر بيانات تجريبي"}
              </h3>
              <p className="text-xs text-slate-500">
                نموذج محاكاة لإدارة المصادر (بدون طلب بيانات اعتماد حقيقية)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. النموذج */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* تنبيه أمان صريح وواضح */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">ضوابط الخصوصية والأمان:</span>
              هذا النموذج للمعاينة البصرية فقط. لا يُطلب ولا يُخزن أي كلمات مرور أو مفاتيح سرية في المتصفح. سيتم توفير الربط الفعلي الآمن عبر الـ Backend لاحقاً.
            </div>
          </div>

          {/* اسم المصدر */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              اسم المصدر (اسم رمزي توضيحي):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قاعدة بيانات المبيعات، أو واجهة الفواتير"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              dir="rtl"
            />
          </div>

          {/* نوع المصدر */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              نوع المصدر:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DataSourceType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              dir="rtl"
            >
              {DATA_SOURCE_TYPES.filter((t) => t !== "all").map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* وصف المصدر */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              وصف المصدر (اختياري):
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب ملاحظة مختصرة حول استخدام هذا المصدر..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
              dir="rtl"
            />
          </div>

          {/* زر اختبار الاتصال التجريبي التوضيحي داخل النموذج */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSimulateTest}
              disabled={testStatus === "testing"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              {testStatus === "testing" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>جاري فحص الاتصال التوضيحي...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>اختبار اتصال محاكى (Test Ping)</span>
                </>
              )}
            </button>

            {testStatus === "success" && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>نجاح الفحص الافتراضي للنموذج (محاكاة).</span>
              </div>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-600/30 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جاري الحفظ...
                </span>
              ) : isEditMode ? (
                "حفظ التعديلات"
              ) : (
                "إضافة المصدر"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
