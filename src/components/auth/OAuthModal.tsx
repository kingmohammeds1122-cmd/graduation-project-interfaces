"use client";

import React, { useState } from "react";
import { Check, Loader2, X, Shield, Building2 } from "lucide-react";

export interface MockAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarColor: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc-1",
    name: "أحمد محمد",
    email: "admin@company.com",
    role: "المدير التنفيذي • المشرف العام",
    department: "Enterprise Admin",
    avatarColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "acc-2",
    name: "سارة العتيبي",
    email: "sarah.data@enterprise.bi",
    role: "رئيسة قسم تحليلات البيانات",
    department: "Lead Data Analyst",
    avatarColor: "from-emerald-600 to-teal-600",
  },
  {
    id: "acc-3",
    name: "خالد المنصور",
    email: "khalid.dev@enterprise.bi",
    role: "مهندس نظم الذكاء الاصطناعي",
    department: "AI & Decision Systems",
    avatarColor: "from-violet-600 to-purple-600",
  },
];

interface OAuthModalProps {
  isOpen: boolean;
  provider: "google" | "apple" | null;
  onClose: () => void;
  onSelectAccount: (account: MockAccount) => Promise<void>;
}

export default function OAuthModal({
  isOpen,
  provider,
  onClose,
  onSelectAccount,
}: OAuthModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("acc-1");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen || !provider) return null;

  const isGoogle = provider === "google";
  const selectedAccount = MOCK_ACCOUNTS.find((a) => a.id === selectedAccountId) || MOCK_ACCOUNTS[0];

  const handleConfirm = async () => {
    setIsAuthenticating(true);
    try {
      await onSelectAccount(selectedAccount);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="relative w-full max-w-md bg-slate-950/90 dark:bg-slate-950/95 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in zoom-in-95 duration-200 text-slate-100">
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={onClose}
          disabled={isAuthenticating}
          className="absolute top-5 left-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          title="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* رأس النافذة المنبثقة وشعار المزود */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg">
            {isGoogle ? (
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            ) : (
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z" />
              </svg>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isGoogle
                ? "المصادقة عبر Google Workspace"
                : "المصادقة عبر Apple ID المؤسسي"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اختر الحساب المؤسسي المعتمد للربط الآمن بمنصة Lunara
            </p>
          </div>
        </div>

        {/* قائمة الحسابات المؤسسية المتاحة */}
        <div className="space-y-2.5 mb-6">
          {MOCK_ACCOUNTS.map((account) => {
            const isSelected = selectedAccountId === account.id;
            return (
              <div
                key={account.id}
                onClick={() => !isAuthenticating && setSelectedAccountId(account.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-slate-900/90 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50"
                    : "bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* الصورة الرمزية */}
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${account.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}
                  >
                    {account.name.slice(0, 1)}
                  </div>

                  {/* بيانات الحساب */}
                  <div className="min-w-0 text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">
                        {account.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-medium">
                        {account.department}
                      </span>
                    </div>
                    <span className="text-xs text-cyan-300/90 font-mono block truncate" dir="ltr">
                      {account.email}
                    </span>
                  </div>
                </div>

                {/* مؤشر الاختيار */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "border border-white/20"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* أزرار الإجراءات */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isAuthenticating}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>جاري التوثيق الأمني وإعداد الجلسة...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-cyan-200" />
                <span>اختر الحساب للمتابعة • Continue</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isAuthenticating}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            إلغاء والمتابعة بحساب آخر
          </button>
        </div>

        {/* تذييل الأمان */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-cyan-400" />
            <span>ربط حسابات المؤسسة المشفر</span>
          </span>
          <span>OAuth 2.0 PKCE Protected</span>
        </div>
      </div>
    </div>
  );
}
