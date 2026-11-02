"use client";

import React from "react";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  UserCheck,
  LogOut,
  ShieldCheck,
  Fingerprint,
  Cpu,
  Server,
} from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface SecurityOverviewSectionProps {
  onOpenLogoutModal: () => void;
}

export default function SecurityOverviewSection({
  onOpenLogoutModal,
}: SecurityOverviewSectionProps) {
  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* 1. بطاقة السياسات الأمنية العامة الزجاجية */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* الترويسة مع شارة Zero-Trust */}
        <div className="border-b border-slate-100 dark:border-white/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  معايير الأمان والسياسات المؤسسية (Zero-Trust Security)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  نظرة شاملة على حماية الميتاداتا، تشفير المتجهات، وسياسات حجب الرموز السرية
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC2 Type II & ISO 27001 Ready</span>
          </div>
        </div>

        {/* 3 بطاقات مؤشرات أمنية تفاعلية بـ GlowCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* بطاقة مفاتيح الذكاء الاصطناعي */}
          <GlowCard glowColor="emerald">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <KeyRound className="w-4 h-4 text-emerald-500" />
                  <span>عزل مفاتيح الـ AI (Secrets Isolation)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                لا تُخزن أو تُمرر أي مفاتيح API (مثل OpenAI أو HuggingFace) إلى متصفح العميل؛ حيث تُعالج حصرياً عبر بيئة الـ Backend المعزولة.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Client-Side Zero Secrets</span>
              </div>
            </div>
          </GlowCard>

          {/* بطاقة المصادقة وتشفير النقل */}
          <GlowCard glowColor="blue">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>تشفير النقل والجلسات (mTLS & AES)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                تعتمد المنصة قنوات اتصال مشفرة عبر TLS 1.3 مع حماية الـ CSRF/XSS وسياسات CORS الصارمة لدعم الـ SSO الموحد.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                <Fingerprint className="w-3 h-3" />
                <span>AES-256 Vector Encryption</span>
              </div>
            </div>
          </GlowCard>

          {/* بطاقة الصلاحيات للقراءة فقط */}
          <GlowCard glowColor="purple">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <UserCheck className="w-4 h-4 text-purple-500" />
                  <span>حوكمة الأدوار (RBAC Least Privilege)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                تُدار الأدوار والصلاحيات مركزياً عبر المشرف الرئيسي لمساحة العمل. لا يمكن رفع الصلاحيات ذاتياً ويُسجل كل استعلام في سجل التدقيق.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-purple-600 dark:text-purple-400">
                <Server className="w-3 h-3" />
                <span>Immutable Audit Trail</span>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* مؤشر النزاهة وحالة الاتصال المباشر */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent border border-blue-500/20 dark:border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                مراقب نزاهة البيئة (Zero-Trust Environment Verification)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                تم فحص كافة التوقيعات الرقمية ونقاط النهاية؛ البيئة تعمل بكامل طاقتها الأمنية بدون أي ثغرات مكشوفة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Security Status: 100% Secure</span>
          </div>
        </div>
      </div>

      {/* 2. منطقة الجلسة وتسجيل الخروج الفعلي / التجريبي الزجاجية */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            جلسة العمل الحالية وإنهاء الاتصال
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تسجيل الخروج الآمن وإلغاء صلاحية الوصول الحالية على هذا المتصفح
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogoutModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج من المنصة</span>
        </button>
      </div>
    </div>
  );
}
