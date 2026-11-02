"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
  Zap,
  BarChart3,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";
import NightDesertBackground from "@/components/auth/NightDesertBackground";
import DayNightSwitch from "@/components/ui/DayNightSwitch";
import { useAuth } from "@/context/AuthContext";

type ForgotStep = "request_otp" | "verify_otp" | "security_choice" | "reset_password" | "completed";

const DEMO_RESET_OTP = "12345";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();

  // إدارة مراحل الدورة (المرحلة 1 -> المرحلة 2 -> المرحلة 3)
  const [step, setStep] = useState<ForgotStep>("request_otp");

  // بيانات الحقول
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // حالات التحميل والتنبيه
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");

  // مراجع الخانات الخمس للرمز السري
  const otp0Ref = useRef<HTMLInputElement>(null);
  const otp1Ref = useRef<HTMLInputElement>(null);
  const otp2Ref = useRef<HTMLInputElement>(null);
  const otp3Ref = useRef<HTMLInputElement>(null);
  const otp4Ref = useRef<HTMLInputElement>(null);

  const otpInputRefs = useMemo(
    () => [otp0Ref, otp1Ref, otp2Ref, otp3Ref, otp4Ref],
    []
  );

  // التركيز التلقائي على الخانة الأولى عند الانتقال للمرحلة الثانية
  useEffect(() => {
    if (step === "verify_otp") {
      const timer = setTimeout(() => {
        otp0Ref.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // المرحلة الأولى: إرسال الرمز وطلب الـ OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("يرجى إدخال عنوان بريد إلكتروني صالح.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setOtpNotice("تم إرسال رمز تحقق مكون من 5 أرقام إلى بريدك الإلكتروني (للتجربة استخدم الرمز: 12345)");
      setStep("verify_otp");
      setOtp(["", "", "", "", ""]);
      setActiveOtpIndex(0);
    }, 600);
  };

  // معالجة تغيير الأرقام في الخانات الخمس
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 4) {
      setActiveOtpIndex(index + 1);
      otpInputRefs[index + 1].current?.focus();
    }

    const currentCombined = newOtp.join("");
    if (currentCombined.length === 5) {
      verifyOtpCode(currentCombined);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1);
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!pasted) return;

    const newOtp = ["", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    if (pasted.length === 5) {
      setActiveOtpIndex(4);
      verifyOtpCode(pasted);
    } else {
      setActiveOtpIndex(pasted.length);
      otpInputRefs[pasted.length]?.current?.focus();
    }
  };

  // التحقق التلقائي من كود الـ OTP
  const verifyOtpCode = (code: string) => {
    setIsVerifyingOtp(true);
    setError("");

    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (code === DEMO_RESET_OTP) {
        setStep("security_choice");
      } else {
        setError("رمز التحقق غير صحيح. يرجى استخدام الرمز التجريبي الموضح أدناه (12345).");
      }
    }, 500);
  };

  // زر التعبئة التلقائية السريعة للرمز الخماسي (12345)
  const handleAutoFillOtp = () => {
    setError("");
    const digits = DEMO_RESET_OTP.split("");
    setOtp(["", "", "", "", ""]);

    digits.forEach((digit, idx) => {
      setTimeout(() => {
        setOtp((prev) => {
          const next = [...prev];
          next[idx] = digit;
          return next;
        });
        setActiveOtpIndex(idx);

        if (idx === 4) {
          setTimeout(() => {
            verifyOtpCode(DEMO_RESET_OTP);
          }, 100);
        }
      }, idx * 80);
    });
  };

  // الخيار الثاني: متابعة مباشرة إلى الشاشة الرئيسية (Dashboard) دون تغيير كلمة المرور
  const handleBypassToDashboard = async () => {
    setIsLoading(true);
    try {
      await login({
        email: email.trim() || "admin@example.com",
        password: "password123",
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // حفظ كلمة المرور الجديدة والتوجه لشاشة تسجيل الدخول
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف أو أرقام.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين، يرجى التأكد.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("completed");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    }, 600);
  };

  return (
    <div
      className="min-h-screen bg-[#020510] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-blue-600 selection:text-white"
      dir="rtl"
    >
      {/* 1. خلفية صحراء الليل والقمر العملاق المتوهج (Night Desert & Glowing Moon) */}
      <NightDesertBackground />

      {/* 2. مفتاح التبديل الليلي/النهاري العائم في الزاوية */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <DayNightSwitch id="forgot-password-theme-toggle" />
      </div>

      {/* 3. النصوص التعريفية المؤسسية المرتبة مع الشارات التقنية */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-3 px-3">
        {/* الشارات التقنية الثلاث المصغرة */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔒 مصادقة آمنة 256-bit</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>⚡ استعلام فوري لحظي</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>📊 تقارير تحليلية ذكية</span>
          </span>
        </div>

        {/* العنوان الاحترافي المؤسسي بتدرج أزرق/سيان/إنديجو هادئ مريح للعين */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200 bg-clip-text text-transparent leading-relaxed max-w-2xl mx-auto">
          تحليل ذكي لقواعد البيانات والمستندات المؤسسية بالاعتماد على الوكلاء الأذكياء
        </h1>

        {/* النص التوضيحي الساحر */}
        <p className="text-slate-300/85 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          نوفر بروتوكولات استعادة وتحقق رقمية مشفرة لضمان استئناف العمل المؤسسي وحماية صلاحيات المشرفين بأعلى درجات الأمان.
        </p>
      </div>

      {/* 4. البطاقة الزجاجية العائمة (Lunara Floating Glassmorphism Card) */}
      <div className="w-full max-w-md bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative z-20 transition-all duration-300 hover:border-white/20">
        {/* خط إضاءة رقيق في الحافة العلوية */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {/* =========================================================================
            المرحلة الأولى: إدخال البريد الإلكتروني وطلب الرمز
            ========================================================================= */}
        {step === "request_otp" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* ترويسة المرحلة الأولى */}
            <div className="text-center space-y-2">
              <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 mb-3">
                <KeyRound className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                استعادة كلمة المرور المؤسسية
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز أمان رقمي مكون من 5 أرقام لتأكيد هويتك.
              </p>
            </div>

            {/* رسالة الخطأ إن وُجدت */}
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* نموذج الإرسال */}
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  البريد الإلكتروني للعمل
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    dir="ltr"
                    className="w-full bg-slate-900/70 border border-white/10 rounded-2xl py-3 pr-10 pl-4 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
                  />
                </div>
              </div>

              {/* زر التجربة السريعة */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEmail("admin@company.com")}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  استخدام البريد التجريبي (admin@company.com)
                </button>
              </div>

              {/* زر إرسال الرمز */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>جاري إرسال رمز الأمان...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال رمز التحقق • Send OTP</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* رابط العودة لتسجيل الدخول */}
            <div className="pt-3 border-t border-white/10 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>العودة إلى شاشة تسجيل الدخول</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            المرحلة الثانية: إدخال الرمز السري في 5 مربعات منفصلة (5-Digit OTP)
            ========================================================================= */}
        {step === "verify_otp" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* رسالة التنبيه الزجاجية بعد الإرسال */}
            {otpNotice && (
              <div className="p-3 rounded-2xl bg-sky-950/50 border border-sky-400/30 text-sky-200 text-xs flex items-start gap-2 shadow-inner">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{otpNotice}</span>
              </div>
            )}

            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                إدخال رمز التحقق السري
              </h2>
              <p className="text-xs text-slate-400">
                أدخل الأرقام الخمسة المرسلة إلى{" "}
                <span className="text-cyan-300 font-mono" dir="ltr">
                  {email || "بريدك الإلكتروني"}
                </span>
              </p>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* المربعات الخمسة المنفصلة للأرقام (5-Digit OTP Boxes) */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 py-2" dir="ltr">
              {otp.map((digit, index) => {
                const isActive = activeOtpIndex === index;
                return (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    onFocus={() => setActiveOtpIndex(index)}
                    disabled={isVerifyingOtp}
                    className={`w-12 h-14 sm:w-13 sm:h-15 rounded-xl text-center text-2xl font-mono tabular-nums font-bold transition-all duration-200 focus:outline-none ${
                      isActive
                        ? "bg-slate-950/90 text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.55)] scale-105"
                        : digit
                        ? "bg-slate-900/90 text-white border border-blue-400/60 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : "bg-slate-900/60 text-slate-400 border border-white/10 shadow-inner hover:border-white/20"
                    }`}
                  />
                );
              })}
            </div>

            {/* مؤشر التحقق التلقائي عند اكتمال الأرقام الخمسة */}
            {isVerifyingOtp && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs font-semibold py-1 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>جاري تأكيد الرمز الأمني وصلاحية الجلسة...</span>
              </div>
            )}

            {/* شريط الرسالة الذكي مع زر التعبئة التلقائية السريعة [Fill (12345)] */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-sky-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
              <div className="text-xs">
                <span className="text-slate-400">رمز الجلسة التجريبي: </span>
                <span className="font-mono font-bold text-cyan-300 tracking-wider">
                  {DEMO_RESET_OTP}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAutoFillOtp}
                disabled={isVerifyingOtp}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>تعبئة تلقائية سريعة • Fill (12345)</span>
              </button>
            </div>

            {/* أزرار الإجراءات السفلية */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("request_otp");
                  setError("");
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تعديل البريد الإلكتروني</span>
              </button>

              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                إلغاء والعودة للدخول
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            المرحلة الثالثة: خيار ما بعد التحقق الآمن (Security Choice Modal / View)
            ========================================================================= */}
        {step === "security_choice" && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            {/* شارة النجاح وتأكيد الهوية */}
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                تم التحقق الأمني من هويتك بنجاح
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                تم تأكيد الجلسة بنجاح عبر الرمز المعتمد. يمكنك الآن اختيار الإجراء المناسب لمتابعة عملك:
              </p>
            </div>

            {/* الخياران الرئيسيان المحدد ان بدقة */}
            <div className="space-y-3 pt-2">
              {/* 1. الزر الأساسي البارز: تغيير كلمة المرور وإعادة التعيين */}
              <button
                type="button"
                onClick={() => {
                  setStep("reset_password");
                  setError("");
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                <KeyRound className="w-4 h-4 text-cyan-200" />
                <span>تغيير كلمة المرور وإعادة التعيين</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* 2. الزر الثانوي الهادئ: متابعة إلى الشاشة الرئيسية (Dashboard) بدون تغيير */}
              <button
                type="button"
                onClick={handleBypassToDashboard}
                disabled={isLoading}
                className="w-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold py-3.5 rounded-2xl border border-white/15 hover:border-white/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>متابعة إلى الشاشة الرئيسية (Dashboard) بدون تغيير</span>
              </button>
            </div>

            {/* رابط العودة لتسجيل الدخول */}
            <div className="pt-2">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                تسجيل الخروج والعودة للشاشة الرئيسية
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            المرحلة الفرعية (تابع للمرحلة الثالثة): إدخال كلمة المرور الجديدة وتأكيدها
            ========================================================================= */}
        {step === "reset_password" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 ring-1 ring-white/20 mb-2">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                تعيين كلمة المرور الجديدة
              </h2>
              <p className="text-xs text-slate-400">
                أدخل كلمة المرور الجديدة لحسابك المؤسسي لتأمين الجلسات المستقبلية
              </p>
            </div>

            {/* رسائل الخطأ */}
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              {/* كلمة المرور الجديدة */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">كلمة المرور الجديدة</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    dir="ltr"
                    className="w-full bg-slate-900/70 border border-white/10 rounded-2xl py-3 pr-10 pl-10 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* تأكيد كلمة المرور الجديدة */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">تأكيد كلمة المرور</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    dir="ltr"
                    className="w-full bg-slate-900/70 border border-white/10 rounded-2xl py-3 pr-10 pl-10 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* زر الحفظ والتوجيه للدخول */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>جاري حفظ كلمة المرور الجديدة...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-cyan-200" />
                    <span>حفظ كلمة المرور والتوجه للدخول</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep("security_choice")}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                الرجوع للخيارات السابقة
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            شاشة الإتمام والنجاح النهائي
            ========================================================================= */}
        {step === "completed" && (
          <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-white">
                تم تغيير كلمة المرور بنجاح!
              </h3>
              <p className="text-xs text-slate-300">
                تم تحديث بيانات الاعتماد الخاصة بحسابك المؤسسي. جاري تحويلك تلقائياً إلى صفحة تسجيل الدخول...
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <span>الانتقال المباشر لتسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* شارة الأمان السفلية */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>تشفير جلسات 256-bit</span>
          </span>
          <span>Lunara Identity Cloud</span>
        </div>
      </div>
    </div>
  );
}
