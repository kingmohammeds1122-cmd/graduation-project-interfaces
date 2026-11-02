"use client";

import React from "react";
import { LogOut, X, Loader2, ShieldAlert } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-md overflow-hidden text-right p-6 space-y-4 text-slate-800 dark:text-slate-100">
        {/* الترويسة والأيقونة */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="إلغاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* النص والتنبيه */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            تأكيد تسجيل الخروج من المنصة
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            هل أنت متأكد من رغبتك في إنهاء الجلسة الحالية وتسجيل الخروج من مساحة العمل؟
          </p>

          <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-slate-700 dark:text-slate-300 text-[11px] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              سيتم محو جلسة المصادقة وتأمين الوصول حتى إعادة تسجيل الدخول عبر بوابة الدخول المعتمدة.
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirmLogout}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الخروج...</span>
              </>
            ) : (
              <span>تأكيد تسجيل الخروج</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
