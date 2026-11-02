"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Loader2,
  Database,
  ArrowLeft,
  ArrowRight,
  Shield,
  Lock,
  Layers,
  Zap,
} from "lucide-react";
import { DataSource, DataSourceType } from "@/types/dataSources.types";

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: DataSourceType; description: string }) => void;
  initialData?: DataSource | null;
  isLoading: boolean;
}

const DATABASE_OPTIONS: {
  type: DataSourceType;
  name: string;
  defaultPort: string;
  driver: string;
  description: string;
  iconBg: string;
}[] = [
  {
    type: "PostgreSQL",
    name: "PostgreSQL المؤسسي",
    defaultPort: "5432",
    driver: "asyncpg / pgvector",
    description: "قاعدة بيانات علائقية تدعم متجهات pgvector وسياسات RLS",
    iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    type: "MySQL",
    name: "MySQL Enterprise",
    defaultPort: "3306",
    driver: "aiomysql / PyMySQL",
    description: "خوادم بيانات المعاملات التشغيلية والتقارير المعتمدة",
    iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    type: "REST API",
    name: "REST / GraphQL API",
    defaultPort: "443",
    driver: "FastAPI / HTTP Client",
    description: "نقاط نهاية برمجية سحابية موثقة برمز JWT / Bearer",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    type: "MongoDB",
    name: "MongoDB NoSQL",
    defaultPort: "27017",
    driver: "Motor / PyMongo",
    description: "مستندات JSON غير المهيكلة وسجلات الأحداث الحية",
    iconBg: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  {
    type: "CSV / Excel",
    name: "CSV / Excel Datasets",
    defaultPort: "N/A",
    driver: "Pandas / Polars Engine",
    description: "مستودعات الجداول المنفصلة وملفات المحاسبة الدورية",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
];

type WizardStep = 1 | 2 | 3;

export default function DataSourceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: DataSourceModalProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [type, setType] = useState<DataSourceType>(initialData?.type || "PostgreSQL");
  const [name, setName] = useState(initialData?.name || "");
  const [host, setHost] = useState("db.enterprise.internal");
  const [port, setPort] = useState(
    DATABASE_OPTIONS.find((o) => o.type === (initialData?.type || "PostgreSQL"))?.defaultPort || "5432"
  );
  const [dbName, setDbName] = useState("analytics_prod");
  const [username, setUsername] = useState("app_reader");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sslMode, setSslMode] = useState<"require" | "verify-full">("require");

  // حالة فحص الاتصال الأمني
  const [testingStep, setTestingStep] = useState<"idle" | "testing" | "success">("idle");
  const [testChecks, setTestChecks] = useState<{ ssl: boolean; auth: boolean; ping: boolean }>({
    ssl: false,
    auth: false,
    ping: false,
  });

  const isEditMode = Boolean(initialData);

  if (!isOpen) return null;

  const handleTypeSelect = (selectedType: DataSourceType) => {
    setType(selectedType);
    const opt = DATABASE_OPTIONS.find((o) => o.type === selectedType);
    if (opt) {
      setPort(opt.defaultPort);
      if (!name || name.startsWith("قاعدة بيانات")) {
        setName(`قاعدة بيانات ${opt.name}`);
      }
    }
  };

  const handleTestConnection = async () => {
    setTestingStep("testing");
    setTestChecks({ ssl: false, auth: false, ping: false });

    // محاكاة الفحص الأمني المتسلسل
    setTimeout(() => {
      setTestChecks((prev) => ({ ...prev, ssl: true }));
    }, 400);

    setTimeout(() => {
      setTestChecks((prev) => ({ ...prev, auth: true }));
    }, 800);

    setTimeout(() => {
      setTestChecks((prev) => ({ ...prev, ping: true }));
      setTestingStep("success");
    }, 1200);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      type,
      description: description.trim() || `اتصال بقاعدة ${type} المحدثة`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
      {/* خلفية معتمة */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-[#070B19]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* بطاقة المعالج المتدرج (Multi-Step Wizard Card) */}
      <div className="w-full max-w-xl bg-white dark:bg-[#0B132B] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden relative z-10 text-right animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* 1. الترويسة وعداد الخطوات */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isEditMode ? "تعديل مصدر البيانات المؤسسي" : "معالج ربط مصدر بيانات جديد"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ربط آمن بخدمات قواعد البيانات بالذكاء الاصطناعي
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* مؤشر الخطوات الثلاث المتسلسلة (Multi-Step Stepper) */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs font-bold">
            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 1
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 shadow-2xs"
                  : step > 1
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
              }`}
            >
              <span>1. نوع القاعدة</span>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 2
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 shadow-2xs"
                  : step > 2
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
              }`}
            >
              <span>2. إعدادات الاتصال</span>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 3
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 shadow-2xs"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
              }`}
            >
              <span>3. فحص وحفظ</span>
            </div>
          </div>
        </div>

        {/* 2. محتوى الخطوات */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* الخطوة 1: اختيار نوع قاعدة البيانات */}
          {step === 1 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                اختر نوع المحرك أو قاعدة البيانات المراد ربطها:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {DATABASE_OPTIONS.map((opt) => {
                  const isSelected = type === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => handleTypeSelect(opt.type)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20 scale-[1.01]"
                          : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shrink-0 ${opt.iconBg}`}
                        >
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                            {opt.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {opt.description}
                          </span>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 block" dir="ltr">
                          Port: {opt.defaultPort}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            محدد
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* الخطوة 2: إعدادات الاتصال الآمنة */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* اسم المصدر التعريفي */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم التعريفي للمصدر
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: قاعدة بيانات المعاملات المركزية"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* المضيف والمنفذ */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    عنوان الخادم (Host)
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    المنفذ (Port)
                  </label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* اسم القاعدة واسم المستخدم */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    اسم قاعدة البيانات
                  </label>
                  <input
                    type="text"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    اسم المستخدم للقراءة
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* وضع التشفير SSL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  وضع التشفير الآمن (SSL Mode)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSslMode("require")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      sslMode === "require"
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    SSL Require (موصى به)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSslMode("verify-full")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      sslMode === "verify-full"
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    SSL Verify-Full (شهادة مخصصة)
                  </button>
                </div>
              </div>

              {/* الوصف الإضافي */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الوصف والغرض التحليلي
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ملاحظات حول الجداول والأغراض التحليلية المستهدفة..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* الخطوة 3: فحص الاتصال وحفظ المصدر */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200 text-center py-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  فحص أمان الاتصال والتحقق من الجاهزية
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  سيقوم محرك المنصة بفحص مصافحة الـ SSL ومصادقة المستخدم وزمن استجابة الشبكة قبل الحفظ
                </p>
              </div>

              {/* قائمة التحقق الأمني المباشرة */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-2.5 text-xs text-right">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Lock className="w-4 h-4 text-blue-500" />
                    <span>تشفير الاتصال ومصافحة SSL Handshake</span>
                  </span>
                  {testChecks.ssl ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ناجح (TLS 1.3)
                    </span>
                  ) : testingStep === "testing" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  ) : (
                    <span className="text-slate-400 font-mono">في الانتظار</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>بروتوكول المصادقة وصلاحيات القراءة</span>
                  </span>
                  {testChecks.auth ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مصرح للقراءة
                    </span>
                  ) : testingStep === "testing" && testChecks.ssl ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  ) : (
                    <span className="text-slate-400 font-mono">في الانتظار</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>زمن الاستجابة الحية (Ping Latency)</span>
                  </span>
                  {testChecks.ping ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      18ms (استجابة ممتازة)
                    </span>
                  ) : testingStep === "testing" && testChecks.auth ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  ) : (
                    <span className="text-slate-400 font-mono">في الانتظار</span>
                  )}
                </div>
              </div>

              {testingStep !== "success" && (
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingStep === "testing"}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {testingStep === "testing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري فحص الاتصال الأمني...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>بدء فحص الاتصال الأمني الآن</span>
                    </>
                  )}
                </button>
              )}

              {testingStep === "success" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>تم التحقق من نجاح الاتصال وجاهزية المخطط للحفظ والربط!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. شريط التنقل بين الخطوات وأزرار الحفظ */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as WizardStep)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الخطوة السابقة</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !name) {
                  setName(`قاعدة بيانات ${type}`);
                }
                setStep((prev) => (prev + 1) as WizardStep);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>المتابعة إلى الخطوة التالية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ والربط...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد وحفظ مصدر البيانات</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
