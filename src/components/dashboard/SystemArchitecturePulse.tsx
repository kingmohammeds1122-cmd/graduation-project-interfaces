"use client";

import React, { useState } from "react";
import {
  Database,
  Sparkles,
  Activity,
  CheckCircle2,
  Server,
  Layers,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import GlowCard, { GlowColor } from "@/components/ui/GlowCard";

interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  tech: string;
  latencyMs: number;
  loadPercent: number;
  status: "healthy" | "active" | "synced";
  statusText: string;
  failoverReady: boolean;
  glowColor: GlowColor;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: "fastapi-gateway",
    name: "بوابة واجهة التطبيقات",
    role: "FastAPI Gateway 2.0",
    tech: "Python 3.12 • Pydantic v2",
    latencyMs: 18,
    loadPercent: 34,
    status: "healthy",
    statusText: "متصل / مستقر",
    failoverReady: true,
    glowColor: "cyan",
    icon: Server,
    description: "استقبال الطلبات، التحقق من التوكنات، وتوزيع الأحمال الفوري",
  },
  {
    id: "ai-agent-planner",
    name: "مخطط الوكلاء الأذكياء",
    role: "AI Agent Planner",
    tech: "ReAct Agent • LangChain",
    latencyMs: 142,
    loadPercent: 48,
    status: "active",
    statusText: "معالجة نشطة",
    failoverReady: true,
    glowColor: "purple",
    icon: Sparkles,
    description: "تفكيك نية الاستفسار، اختيار الأدوات، وهندسة الأوامر",
  },
  {
    id: "query-rag-engine",
    name: "محرك الاستعلام واسترجاع المتجهات",
    role: "SQL & RAG Vector Engine",
    tech: "pgvector • Dynamic SQL",
    latencyMs: 64,
    loadPercent: 38,
    status: "synced",
    statusText: "متزامن لحظياً",
    failoverReady: true,
    glowColor: "blue",
    icon: Layers,
    description: "توليد كود SQL الآمن ومطابقة تشابه المتجهات بدقة 96.8%",
  },
  {
    id: "supabase-db",
    name: "قاعدة البيانات المؤسسية",
    role: "Supabase / PostgreSQL",
    tech: "PostgreSQL 16 • RLS",
    latencyMs: 22,
    loadPercent: 28,
    status: "healthy",
    statusText: "مستقر / مكرر",
    failoverReady: true,
    glowColor: "emerald",
    icon: Database,
    description: "عزل البيانات المؤسسية وسياسات أمان الصفوف والنسخ الاحتياطي",
  },
];

export default function SystemArchitecturePulse() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulatePulse = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 900);
  };

  return (
    <div className="space-y-4">
      {/* 1. الترويسة العلوية للوحة نبض البنية التحتية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                مراقب البنية التحتية وتوزيع الأحمال
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
                Architecture Pulse
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              المسار الهندسي الحي لمعالجة الاستفسارات وتدفق البيانات بين طبقات المنصة
            </p>
          </div>
        </div>

        {/* المؤشرات السريعة وزر محاكاة النبض */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* شارة التعافي التلقائي */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px]">التعافي التلقائي نشط (Failover Ready)</span>
          </div>

          <button
            type="button"
            onClick={handleSimulatePulse}
            disabled={isSimulating}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10 cursor-pointer"
            title="فحص نبض الاتصال اللحظي"
            aria-label="تحديث النبض"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? "animate-spin text-blue-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. خط الأنابيب المعماري المباشر (Architecture Pipeline Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
        {ARCHITECTURE_NODES.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;

          return (
            <div key={node.id} className="relative group">
              <GlowCard
                glowColor={node.glowColor}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={`h-full cursor-pointer ${
                  isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                }`}
              >
                {/* ترويسة العقدة */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block" dir="ltr">
                        {node.role}
                      </span>
                    </div>
                  </div>

                  {/* رقم الترتيب في المعمارية */}
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center font-mono">
                    0{index + 1}
                  </span>
                </div>

                {/* مقاييس الأداء: زمن الاستجابة والحالة */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">زمن الاستجابة</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                          {node.latencyMs}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ms</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-medium">حالة الطبقة</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{node.statusText}</span>
                      </span>
                    </div>
                  </div>

                  {/* شريط توزيع الحمل (Load Distribution Bar) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        توزيع الحمل (Load)
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {node.loadPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          node.glowColor === "cyan"
                            ? "bg-gradient-to-l from-cyan-500 to-blue-500"
                            : node.glowColor === "purple"
                            ? "bg-gradient-to-l from-purple-500 to-indigo-500"
                            : node.glowColor === "blue"
                            ? "bg-gradient-to-l from-blue-600 to-indigo-600"
                            : "bg-gradient-to-l from-emerald-500 to-teal-500"
                        }`}
                        style={{ width: `${node.loadPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* التقنية ونبذة موجزة */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate" dir="ltr">
                      {node.tech}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                      تفاصيل
                    </span>
                  </div>

                  {/* عرض موسع اختياري عند النقر */}
                  {isSelected && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 animate-in fade-in duration-200">
                      {node.description}
                    </div>
                  )}
                </div>
              </GlowCard>

              {/* سهم مؤشر التدفق بين العقد لشاشات الحاسوب */}
              {index < ARCHITECTURE_NODES.length - 1 && (
                <div
                  className="hidden lg:flex absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/20 items-center justify-center text-slate-400 shadow-sm pointer-events-none"
                  aria-hidden="true"
                >
                  <ArrowLeft className="w-3 h-3 text-blue-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
