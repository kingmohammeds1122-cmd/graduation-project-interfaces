"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  Zap,
  RotateCcw,
  Building,
  Eye,
  EyeOff,
  Check,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/error-handler";
import NightDesertBackground from "@/components/auth/NightDesertBackground";
import DayNightSwitch from "@/components/ui/DayNightSwitch";
import OAuthModal, { MockAccount } from "@/components/auth/OAuthModal";

type AuthMode = "login" | "register";
type AuthStep = "form" | "2fa";
type OtpPhase = "idle" | "aligning" | "orbiting" | "success";

const DEMO_OTP_CODE = "4719";
const REMEMBERED_EMAIL_KEY = "enterprise_remembered_email";

// الجزيئات الملونة الـ 24 للاحتفال بنجاح التحقق
const CONFETTI_PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i * 360) / 24;
  const rad = (angle * Math.PI) / 180;
  const distance = 60 + (i % 3) * 20;
  const x = Math.round(Math.cos(rad) * distance);
  const y = Math.round(Math.sin(rad) * distance);
  const colors = [
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ec4899", // pink
    "#14b8a6", // teal
    "#6366f1", // indigo
  ];
  return {
    id: i,
    x,
    y,
    color: colors[i % colors.length],
    size: 6 + (i % 3) * 2,
    shape: i % 2 === 0 ? "rounded-full" : "rounded-xs",
    angle,
  };
});

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isMockMode } = useAuth();

  // وضع التسجيل أو الدخول
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [authStep, setAuthStep] = useState<AuthStep>("form");

  // حقول تسجيل الدخول (مع دعم تذكرني المحفوظ مسبقاً)
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
      } catch {
        // safe fallback
      }
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY));
      } catch {
        // safe fallback
      }
    }
    return true;
  });

  // حقول إنشاء الحساب
  const [regName, setRegName] = useState("");
  const [regOrgName, setRegOrgName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // حالة التحقق الثنائي (2FA OTP)
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [otpPhase, setOtpPhase] = useState<OtpPhase>("idle");
  const [isVerifyingText, setIsVerifyingText] = useState(false);

  const otp0Ref = useRef<HTMLInputElement>(null);
  const otp1Ref = useRef<HTMLInputElement>(null);
  const otp2Ref = useRef<HTMLInputElement>(null);
  const otp3Ref = useRef<HTMLInputElement>(null);

  const otpInputRefs = useMemo(
    () => [otp0Ref, otp1Ref, otp2Ref, otp3Ref],
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [oauthModalProvider, setOauthModalProvider] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // إدارة حفظ البريد أو حذفه بناءً على حالة "تذكرني"
  const handleRememberMeSync = (targetEmail: string) => {
    try {
      if (rememberMe && targetEmail) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, targetEmail.trim());
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      // safe fallback
    }
  };

  // التركيز التلقائي عند الدخول لطور 2FA
  useEffect(() => {
    if (authStep === "2fa") {
      const timer = setTimeout(() => {
        otp0Ref.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  // التبديل بين الدخول والتسجيل
  const toggleAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthStep("form");
    setError("");
    setSuccessMessage("");
  };

  // 1. بدء الدخول والانتقال للـ 2FA
  const handleInitiateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    handleRememberMeSync(email);
    setAuthStep("2fa");
    setOtp(["", "", "", ""]);
    setActiveOtpIndex(0);
    setOtpPhase("idle");
    setIsVerifyingText(false);
  };

  // 2. التحقق من كود الـ OTP
  const startOrbitVerification = (codeToVerify: string) => {
    if (otpPhase !== "idle") return;

    if (codeToVerify !== DEMO_OTP_CODE && codeToVerify !== "1234") {
      setError("رمز التحقق غير صحيح. يرجى استخدام الرمز التجريبي 4719.");
      setOtp(["", "", "", ""]);
      setActiveOtpIndex(0);
      otp0Ref.current?.focus();
      return;
    }

    setError("");
    setOtpPhase("aligning");

    setTimeout(() => {
      setOtpPhase("orbiting");
      setIsVerifyingText(true);

      setTimeout(async () => {
        setOtpPhase("success");

        try {
          handleRememberMeSync(email);
          await login({
            email: email.trim() || "admin@example.com",
            password: password || "password123",
          });

          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 950);
        } catch (err: unknown) {
          setOtpPhase("idle");
          setIsVerifyingText(false);
          setError(handleApiError(err));
        }
      }, 900);
    }, 350);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (otpPhase !== "idle") return;
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 3) {
      setActiveOtpIndex(index + 1);
      otpInputRefs[index + 1].current?.focus();
    }

    const currentCombined = newOtp.join("");
    if (currentCombined.length === 4) {
      setTimeout(() => {
        startOrbitVerification(currentCombined);
      }, 80);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (otpPhase !== "idle") return;
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1);
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (otpPhase !== "idle") return;
    setError("");
    const digits = DEMO_OTP_CODE.split("");
    setOtp(["", "", "", ""]);

    digits.forEach((digit, idx) => {
      setTimeout(() => {
        setOtp((prev) => {
          const next = [...prev];
          next[idx] = digit;
          return next;
        });
        setActiveOtpIndex(idx);

        if (idx === 3) {
          setTimeout(() => {
            startOrbitVerification(DEMO_OTP_CODE);
          }, 120);
        }
      }, idx * 90);
    });
  };

  // الدخول التجريبي الفوري بنقرة واحدة
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      handleRememberMeSync("admin@example.com");
      await login({
        email: "admin@example.com",
        password: "password123",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // فتح نافذة اختيار الحساب المؤسسي لمصادقة OAuth
  const handleOpenOAuthModal = (provider: "google" | "apple") => {
    setError("");
    setOauthModalProvider(provider);
  };

  // تأكيد واختيار الحساب من نافذة الـ OAuth المنبثقة
  const handleConfirmOAuthAccount = async (account: MockAccount) => {
    try {
      handleRememberMeSync(account.email);
      await login({
        email: account.email,
        password: "password123",
      });
      setOauthModalProvider(null);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(handleApiError(err));
    }
  };

  // إنشاء حساب مؤسسي جديد
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!regName || !regEmail || !regPassword) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة لتسجيل المؤسسة.");
      }

      if (regPassword.length < 6) {
        throw new Error("يجب أن تتكون كلمة المرور من 6 خانات على الأقل.");
      }

      handleRememberMeSync(regEmail);
      await register({
        email: regEmail.trim(),
        password: regPassword,
      });

      setSuccessMessage("تم إنشاء الحساب المؤسسي بنجاح! جاري التوجيه إلى لوحة التحكم...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 900);
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#020510] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-blue-600 selection:text-white"
      dir="rtl"
    >
      {/* 1. خلفية صحراء الليل الساحرة والقمر العملاق المتوهج (Night Desert & Glowing Moon) */}
      <NightDesertBackground />

      {/* 2. مفتاح التبديل الليلي/النهاري العائم في الزاوية العلوية */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <DayNightSwitch id="login-theme-toggle" />
      </div>

      {/* 3. النصوص التعريفية المؤسسية المبهرة في المساحة العلوية */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-3 px-3">
        {/* الشارات التقنية الثلاث المصغرة والمرتبة بلغة بصرية هادئة ومريحة */}
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

        {/* النص التوضيحي الساحر بدون كلمة "استنطق" */}
        <p className="text-slate-300/85 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          استكشف رؤى أعمالك، وحلل مصادر البيانات ومستودعات PostgreSQL والمستندات بنماذج متخصصة لاستخراج القرارات التنفيذية بدقة وموثوقية فائقة.
        </p>
      </div>

      {/* 4. البطاقة الزجاجية العائمة والعميقة (Lunara Floating Glassmorphism Card) */}
      <div className="w-full max-w-md bg-slate-950/75 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative z-20 transition-all duration-300 hover:border-white/20">
        {/* خط إضاءة رقيق في الحافة العلوية للبطاقة */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {/* الترويسة الأنيقة للبطاقة */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {authStep === "2fa"
              ? "التحقق الأمني الذكي (2FA)"
              : authMode === "login"
              ? "Welcome back"
              : "إنشاء حساب جديد"}
          </h2>

          <p className="text-xs text-slate-400">
            {authStep === "2fa"
              ? "خطوة أمان إضافية لمصادقة هوية المشرف وحماية الجلسة"
              : authMode === "login"
              ? "Sign in to continue to Lunara / منصة ذكاء الأعمال"
              : "سجل بيانات مؤسستك للانطلاق في تحليل البيانات بالذكاء الاصطناعي"}
          </p>
        </div>

        {/* رسائل التنبيه والخطأ إن وجدت */}
        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        {/* =====================================================================
            محتوى البطاقة حسب الحالة (2FA أو تسجيل الدخول أو إنشاء الحساب)
            ===================================================================== */}
        {authStep === "2fa" ? (
          /* طور التحقق الثنائي OTP */
          <div className="space-y-6 pt-1 animate-in fade-in duration-300">
            {/* منصة الحركة المدارية للمربعات الأربعة */}
            <div className="relative h-40 flex items-center justify-center overflow-visible select-none">
              <div
                className={`relative w-40 h-40 flex items-center justify-center transition-all ${
                  otpPhase === "orbiting"
                    ? "duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    : "duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                }`}
                style={{
                  transform:
                    otpPhase === "orbiting"
                      ? "rotate(450deg) scale(0.25)"
                      : otpPhase === "success"
                      ? "scale(0) opacity(0)"
                      : "rotate(0deg) scale(1)",
                  opacity: otpPhase === "success" ? 0 : 1,
                }}
              >
                {otp.map((digit, index) => {
                  const isActive = activeOtpIndex === index && otpPhase === "idle";
                  let tx = -84 + index * 56;
                  let ty = 0;

                  if (otpPhase === "aligning" || otpPhase === "orbiting") {
                    if (index === 0) {
                      tx = 0;
                      ty = -44;
                    } else if (index === 1) {
                      tx = 44;
                      ty = 0;
                    } else if (index === 2) {
                      tx = 0;
                      ty = 44;
                    } else if (index === 3) {
                      tx = -44;
                      ty = 0;
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 -mt-7 -ml-6 w-12 h-14 sm:w-13 sm:h-15 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center"
                      style={{
                        transform: `translate(${tx}px, ${ty}px)`,
                      }}
                    >
                      <input
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onFocus={() => setActiveOtpIndex(index)}
                        disabled={otpPhase !== "idle"}
                        className={`w-full h-full rounded-2xl text-center text-xl font-mono font-bold transition-all duration-200 focus:outline-none ${
                          isActive
                            ? "bg-slate-950/80 text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105"
                            : digit
                            ? "bg-slate-900/90 text-white border border-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                            : "bg-slate-950/60 text-slate-400 border border-white/10 shadow-inner hover:border-white/20"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* شارة النجاح الخضراء وانفجار الجزيئات */}
              {otpPhase === "success" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-18 h-18 rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.7)] flex items-center justify-center text-white ring-4 ring-emerald-400/30 animate-in zoom-in-75 duration-300">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>

                  {CONFETTI_PARTICLES.map((particle) => (
                    <span
                      key={particle.id}
                      className={`absolute ${particle.shape} animate-in fade-in duration-500`}
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.angle}deg)`,
                        transition: "all 750ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* حالة التحقق */}
            <div className="text-center min-h-[26px] flex items-center justify-center">
              {isVerifyingText && otpPhase !== "success" ? (
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Verifying... جاري التحقق الأمني وتوثيق الجلسة</span>
                </div>
              ) : otpPhase === "success" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in duration-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified & Secure • تم التحقق بنجاح</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  أدخل رمز التحقق الرباعي لتأكيد الدخول
                </span>
              )}
            </div>

            {/* رسالة النظام الذكية وزر التعبئة السريعة */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-sky-400/20 flex items-center justify-between gap-2 shadow-inner">
              <div className="text-xs">
                <span className="text-slate-400">رمز الجلسة التجريبي: </span>
                <span className="font-mono font-bold text-cyan-300">{DEMO_OTP_CODE}</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                disabled={otpPhase !== "idle"}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span>تعبئة تلقائية • Fill</span>
              </button>
            </div>

            {/* خيارات العودة والتخطي */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthStep("form");
                  setError("");
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تعديل البيانات</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline underline-offset-4"
              >
                تخطي التحقق (دخول فوري)
              </button>
            </div>
          </div>
        ) : authMode === "login" ? (
          /* =====================================================================
              نموذج تسجيل الدخول الرئيسي (Sign in Form)
              ===================================================================== */
          <form onSubmit={handleInitiateLogin} className="space-y-4">
            {/* حقل البريد الإلكتروني (Email Input) بتصميم زجاجي بارز وناعم */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
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
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3 pr-10 pl-4 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
                />
              </div>
            </div>

            {/* حقل كلمة المرور (Password Input) مع أيقونة العين */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3 pr-10 pl-10 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* سطر: تذكرني (Remember me) ورابط نسيت كلمة المرور (Forgot password) */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-white/20 bg-slate-900/80 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer accent-blue-600"
                />
                <span>تذكرني (Remember me)</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول الرئيسي (Sign in) بتدرج لوني أزرق/بنفسجي متوهج */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 group cursor-pointer text-xs sm:text-sm mt-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>Sign in • تسجيل الدخول</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* زر الدخول التجريبي الفوري المباشر */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold py-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>دخول تجريبي فوري (تخطي التحقق)</span>
            </button>

            {/* الفاصل الأنيق: or continue with */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#070d24] text-[11px] text-slate-400 font-medium rounded-full border border-white/5">
                or continue with • أو عبر
              </span>
            </div>

            {/* زرا تسجيل الدخول السريع عبر Google و Apple (تفتح نافذة اختيار الحساب المنبثقة) */}
            <div className="grid grid-cols-2 gap-3">
              {/* زر Google */}
              <button
                type="button"
                onClick={() => handleOpenOAuthModal("google")}
                className="bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-white/20 rounded-2xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all hover:shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Google</span>
              </button>

              {/* زر Apple */}
              <button
                type="button"
                onClick={() => handleOpenOAuthModal("apple")}
                className="bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-white/20 rounded-2xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all hover:shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* رابط الانتقال إلى إنشاء حساب جديد */}
            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400">جديد في المنصة؟ </span>
              <button
                type="button"
                onClick={() => toggleAuthMode("register")}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer underline underline-offset-4"
              >
                إنشاء حساب مؤسسي جديد
              </button>
            </div>
          </form>
        ) : (
          /* =====================================================================
              نموذج إنشاء حساب مؤسسي جديد (Sign up Form)
              ===================================================================== */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-300">
            {/* اسم المسؤول */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">اسم المسؤول</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="أحمد محمد"
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-2.5 pr-10 pl-3 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* اسم الشركة */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">اسم المؤسسة أو الشركة</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={regOrgName}
                  onChange={(e) => setRegOrgName(e.target.value)}
                  placeholder="شركة التحليلات الذكية"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-2.5 pr-10 pl-3 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني للعمل</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="corp@example.com"
                  required
                  dir="ltr"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-2.5 pr-10 pl-3 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
                <span className="text-[11px] text-slate-500">6 خانات على الأقل</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-2.5 pr-10 pl-10 text-white text-xs sm:text-sm placeholder:text-slate-500 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* زر تأكيد إنشاء الحساب */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>جاري إعداد حساب المؤسسة...</span>
                </>
              ) : (
                <>
                  <span>إنشاء حساب المؤسسة والانطلاق</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

            {/* رابط العودة لتسجيل الدخول */}
            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400">لديك حساب مسؤول مسبقاً؟ </span>
              <button
                type="button"
                onClick={() => toggleAuthMode("login")}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer underline underline-offset-4"
              >
                تسجيل الدخول إلى حسابك
              </button>
            </div>
          </form>
        )}

        {/* شارة التشفير والحوكمة في أسفل البطاقة */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {isMockMode ? "وضع المحاكاة نشط (Mock API)" : "بيئة إنتاجية آمنة (Production)"}
          </span>
          <span>تشفير 256-bit AES</span>
        </div>
      </div>

      {/* 5. نافذة اختيار الحساب المنبثقة لمصادقة OAuth (Google / Apple) */}
      <OAuthModal
        isOpen={oauthModalProvider !== null}
        provider={oauthModalProvider}
        onClose={() => setOauthModalProvider(null)}
        onSelectAccount={handleConfirmOAuthAccount}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020510] flex items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
