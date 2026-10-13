"use client";

import React, { useState } from "react";
import {
  Building2,
  Briefcase,
  ShieldCheck,
  Calendar,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import { UserProfile } from "@/types/settings.types";

interface ProfileSectionProps {
  profile: UserProfile;
  onSaveProfile: (data: { name: string; email: string }) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileSection({
  profile,
  onSaveProfile,
  isSaving,
}: ProfileSectionProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProfile({ name, email });
  };

  return (
    <div className="space-y-6">
      {/* 1. بطاقة الهوية وحساب المستخدم */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm border-2 border-white">
              {profile.avatarText}
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {profile.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono" dir="ltr">
                {profile.email}
              </p>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                <span>{profile.accountType}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>تاريخ الانضمام: {profile.joinedDate}</span>
          </div>
        </div>

        {/* 2. تفاصيل المؤسسة ومساحة العمل (للقراءة فقط) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>المؤسسة:</span>
            </span>
            <p className="text-xs font-bold text-slate-800">
              {profile.organization}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>مساحة العمل:</span>
            </span>
            <p className="text-xs font-bold text-slate-800">
              {profile.workspaceName}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>الدور والصلاحيات:</span>
            </span>
            <p className="text-xs font-bold text-slate-800">
              {profile.roleLabel}
            </p>
          </div>
        </div>

        {/* إشعار بأن الصلاحيات للقراءة فقط ولا يمكن تعديلها */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            ملاحظة أمنية: يتم إدارة وتعيين الأدوار والصلاحيات مركزياً عبر المشرف ولا يمكن تغييرها ذاتياً.
          </span>
        </div>
      </div>

      {/* 3. نموذج تعديل البيانات الشخصية محلياً */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            تعديل معلومات الملف الشخصي (محاكاة الواجهة)
          </h4>
          <p className="text-xs text-slate-500">
            يمكنك تجربة تعديل الاسم والبريد؛ التغيير محلي للعرض فقط ولا يتم حفظه على خادم.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="user-name-input" className="text-xs font-bold text-slate-700 block">
              الاسم الكامل
            </label>
            <input
              id="user-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
              dir="rtl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="user-email-input" className="text-xs font-bold text-slate-700 block">
              البريد الإلكتروني
            </label>
            <input
              id="user-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all text-left"
              dir="ltr"
              required
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            لا تُخزن كلمات مرور أو مفاتيح اعتماد في هذه الشاشة.
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الحفظ التجريبي...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التعديلات تجريبياً</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
