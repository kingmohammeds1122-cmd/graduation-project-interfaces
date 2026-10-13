"use client";

import React from "react";
import { LogOut, X, Loader2, Info } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  isLoading: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirmLogout,
  isLoading,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-right p-6 space-y-4">
        {/* الترويسة والأيقونة */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="إلغاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* النص والتنبيه */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">
            تأكيد تسجيل الخروج التجريبي
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            هل ترغب في محاكاة تسجيل الخروج من مساحة العمل الحالية؟
          </p>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              تنبيه الشفافية: هذا الزر هو محاكاة تجريبية لتجربة المستخدم؛ لا توجد جلسة فعلية أو توكن مصادقة خادم يتم إنهاؤه حالياً.
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirmLogout}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shadow-rose-600/30 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري محاكاة الخروج...</span>
              </>
            ) : (
              <span>تسجيل خروج تجريبي</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
