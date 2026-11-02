"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Database,
  FileSearch,
  LineChart,
} from "lucide-react";
import { ReasoningStep, ChatScope } from "@/types/chat.types";

interface ChatReasoningStepperProps {
  currentStepIndex?: number;
  steps?: ReasoningStep[];
  isLiveLoading?: boolean;
  scope?: ChatScope;
}

export const DEFAULT_REASONING_STEPS: ReasoningStep[] = [
  {
    id: "step-1",
    title: "1. فهم وتحليل الاستفسار المؤسسي",
    description: "تفكيك السؤال واستخراج الكلمات المفتاحية والمؤشرات المالية/التشغيلية المطلوبة",
    status: "completed",
  },
  {
    id: "step-2",
    title: "2. استعلام مصادر البيانات واسترجاع المستندات",
    description: "مطابقة فهارس RAG المعرفية واستعلام جداول قواعد البيانات المعتمدة",
    status: "running",
  },
  {
    id: "step-3",
    title: "3. توليد التحليل وصياغة الرؤى",
    description: "تلخيص النتائج، استخراج الرؤى الأساسية، وإعداد الجداول والمراجع",
    status: "pending",
  },
];

export default function ChatReasoningStepper({
  currentStepIndex = 1,
  steps,
  isLiveLoading = true,
  scope = "all",
}: ChatReasoningStepperProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStep, setActiveStep] = useState(() => (isLiveLoading ? currentStepIndex : 3));

  // تحريك الخطوات تلقائياً أثناء وضع التحميل الحي (Live Simulation)
  useEffect(() => {
    if (!isLiveLoading) {
      return;
    }

    const timer1 = setTimeout(() => setActiveStep(2), 600);
    const timer2 = setTimeout(() => setActiveStep(3), 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLiveLoading]);

  const displaySteps = steps || DEFAULT_REASONING_STEPS;

  const getScopeLabel = () => {
    switch (scope) {
      case "databases":
        return "قواعد البيانات المركزية";
      case "documents":
        return "قاعدة المعرفة والمستندات";
      case "all":
      default:
        return "كافة المصادر والمستندات";
    }
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Brain className="w-3.5 h-3.5" />;
      case 1:
        return scope === "databases" ? (
          <Database className="w-3.5 h-3.5" />
        ) : (
          <FileSearch className="w-3.5 h-3.5" />
        );
      case 2:
      default:
        return <LineChart className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/95 text-slate-100 rounded-2xl border border-slate-800 shadow-lg overflow-hidden transition-all animate-fade-in">
      {/* الترويسة القابلة للطي */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-850/60 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600/30 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Sparkles className={`w-3.5 h-3.5 ${isLiveLoading ? "animate-spin" : ""}`} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide font-sans">
              مسار تفكير وتحليل الوكيل الذكي (AI Reasoning)
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              النطاق: {getScopeLabel()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLiveLoading ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-800/60">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>جاري التحليل...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              <span>اكتمل التفكير</span>
            </span>
          )}

          <button
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-white"
            aria-label="طي/توسيع مسار التفكير"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* محتوى خطوات التفكير */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/40">
          <div className="space-y-3 relative before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {displaySteps.map((step, idx) => {
              const stepNum = idx + 1;
              const isCompleted = isLiveLoading ? activeStep > stepNum : true;
              const isRunning = isLiveLoading && activeStep === stepNum;

              return (
                <div key={step.id} className="relative flex items-start gap-3 pr-1">
                  {/* الدائرة / أيقونة الخطوة */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/30"
                        : isRunning
                        ? "bg-violet-600 text-white ring-4 ring-violet-500/20 shadow-md shadow-violet-600/40"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      getStepIcon(idx)
                    )}
                  </div>

                  {/* نص وتفاصيل الخطوة */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isCompleted
                            ? "text-emerald-300"
                            : isRunning
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      {isRunning && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
