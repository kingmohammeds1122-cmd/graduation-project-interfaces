import React from "react";
import { Database, FileText, Sparkles, Activity } from "lucide-react";
import { DashboardMetric } from "@/types/dashboard.types";

interface StatCardProps {
  metric: DashboardMetric;
}

export default function StatCard({ metric }: StatCardProps) {
  // تحديد الأيقونة واللمسة البصرية المتناسقة وفق هوية التصميم المعتمدة
  const getIconAndAccent = () => {
    switch (metric.category) {
      case "queries":
        return {
          icon: Sparkles,
          iconColor: "text-violet-600",
          iconBg: "bg-violet-50 border-violet-100",
        };
      case "data-sources":
        return {
          icon: Database,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50 border-blue-100",
        };
      case "documents":
        return {
          icon: FileText,
          iconColor: "text-slate-700",
          iconBg: "bg-slate-100 border-slate-200",
        };
      case "status":
      default:
        return {
          icon: Activity,
          iconColor: "text-emerald-600",
          iconBg: "bg-emerald-50 border-emerald-100",
        };
    }
  };

  const { icon: Icon, iconColor, iconBg } = getIconAndAccent();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      {/* الترويسة العلوية للكارد والأيقونة */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-500 truncate">
          {metric.title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${iconBg}`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {/* الرقم الرئيسي والمؤشر */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            {metric.value}
          </span>
          {metric.changePercent && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                metric.changeType === "positive"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {metric.changePercent}
            </span>
          )}
        </div>

        {/* النص التوضيحي وتأكيد الوضع التجريبي */}
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {metric.subtext}
        </p>
      </div>

      {/* شارة توضيحية شفافة للبيانات التجريبية */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>مؤشر تجريبي (Mock)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
      </div>
    </div>
  );
}
