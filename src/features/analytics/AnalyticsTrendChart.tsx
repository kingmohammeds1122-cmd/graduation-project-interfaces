"use client";

import React, { useState } from "react";
import {
  Table as TableIcon,
  LineChart as ChartIcon,
} from "lucide-react";
import { TrendDataPoint } from "@/types/analytics.types";

interface AnalyticsTrendChartProps {
  title: string;
  description: string;
  unit: string;
  periodLabel: string;
  points: TrendDataPoint[];
}

export default function AnalyticsTrendChart({
  title,
  description,
  unit,
  periodLabel,
  points,
}: AnalyticsTrendChartProps) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  if (points.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center text-slate-400 text-xs">
        لا توجد بيانات متاحة لهذا النطاق الزمني.
      </div>
    );
  }

  // حسابات الرسم البياني
  const values = points.map((p) => p.value);
  const rawMax = Math.max(...values, 10);
  // إضافة هامش علوي للمحور الرأسي
  const maxValue = Math.ceil(rawMax * 1.15);
  const totalSum = values.reduce((acc, v) => acc + v, 0);
  const avgValue = Math.round(totalSum / values.length);
  const maxPoint = points.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), points[0]);

  // إحداثيات الرسم البياني (SVG Coordinates)
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (points.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - 0) / maxValue;
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  // توليد مسار الخط (Line Path) والانحناء السلس
  const coordinates = points.map((p, idx) => ({ x: getX(idx), y: getY(p.value) }));

  // إنشاء مسار انسيابي سلس (Cubic Bezier Spline)
  let linePathD = "";
  if (coordinates.length > 0) {
    linePathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const p0 = coordinates[i];
      const p1 = coordinates[i + 1];
      const midX = (p0.x + p1.x) / 2;
      linePathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // مسار المنطقة المظللة تحت الخط (Area Fill Path)
  const areaPathD = `${linePathD} L ${coordinates[coordinates.length - 1].x} ${
    paddingTop + chartHeight
  } L ${coordinates[0].x} ${paddingTop + chartHeight} Z`;

  // خطوط شبكة المحور الرأسي
  const yTicks = [0, Math.round(maxValue / 3), Math.round((maxValue * 2) / 3), maxValue];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. ترويسة الرسم وأزرار التبديل */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {periodLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {description} • <span className="font-semibold text-slate-700">الوحدة: {unit}</span>
          </p>
        </div>

        {/* أزرار التبديل بين الرسم والجدول */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode("chart")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "chart"
                  ? "bg-white text-blue-700 shadow-2xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ChartIcon className="w-3.5 h-3.5" />
              <span>مخطط بياني</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-blue-700 shadow-2xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>جدول بديل</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. منطقة العرض الرئيسي: الرسم أو الجدول */}
      {viewMode === "chart" ? (
        <div className="space-y-3">
          <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-2xl border border-slate-100 p-2 sm:p-4">
            {/* مؤشر النقطة المحددة إن وجدت */}
            {activePointIndex !== null && points[activePointIndex] && (
              <div
                className="absolute top-3 left-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in z-10 flex items-center gap-2"
                dir="rtl"
              >
                <span className="font-bold text-blue-300">
                  {points[activePointIndex].label}:
                </span>
                <span className="font-mono font-bold">
                  {points[activePointIndex].formattedValue}
                </span>
              </div>
            )}

            {/* الرسم البياني SVG */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-64 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* خطوط شبكة المحور الرأسي Y */}
              {yTicks.map((tick, idx) => {
                const y = getY(tick);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* المنطقة المظللة (Area Fill) */}
              <path d={areaPathD} fill="url(#trendGradient)" />

              {/* خط الاتجاه الرئيسي (Line Stroke) */}
              <path
                d={linePathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* نقاط البيانات التفاعلية (Data Points) والتسميات على المحور الأفقي */}
              {coordinates.map((coord, idx) => {
                const p = points[idx];
                const isActive = activePointIndex === idx;

                return (
                  <g key={p.periodKey} className="cursor-pointer">
                    {/* عمود تفاعلي شفاف لتسهيل النقر والتحويم */}
                    <rect
                      x={coord.x - chartWidth / (points.length * 2)}
                      y={paddingTop}
                      width={chartWidth / points.length}
                      height={chartHeight + paddingBottom}
                      fill="transparent"
                      onMouseEnter={() => setActivePointIndex(idx)}
                      onClick={() => setActivePointIndex(idx)}
                    />

                    {/* الدائرة الظاهرة */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isActive ? 5.5 : 3.5}
                      fill={isActive ? "#1d4ed8" : "#ffffff"}
                      stroke="#2563eb"
                      strokeWidth={isActive ? "2.5" : "2"}
                      className="transition-all duration-150"
                    />

                    {/* تسمية المحور الأفقي X */}
                    <text
                      x={coord.x}
                      y={paddingTop + chartHeight + 20}
                      textAnchor="middle"
                      fill={isActive ? "#1e293b" : "#64748b"}
                      fontWeight={isActive ? "bold" : "normal"}
                      fontSize={points.length > 8 ? "8" : "10"}
                      className="select-none"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        /* جدول بديل تفصيلي (Accessible Table View) */
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3">الفترة / التاريخ</th>
                <th className="p-3">القيمة الرقمية</th>
                <th className="p-3">القيمة المنسقة</th>
                <th className="p-3">النسبة من الذروة ({maxPoint.formattedValue})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {points.map((p) => {
                const ratio = Math.round((p.value / rawMax) * 100);
                return (
                  <tr key={p.periodKey} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{p.label}</td>
                    <td className="p-3 font-mono text-slate-700">{p.value}</td>
                    <td className="p-3 text-slate-600">{p.formattedValue}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{ratio}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. ملخص نصي إحصائي تحليلي */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">الإجمالي التراكمي للفترة:</span>
          <span className="font-bold font-sans text-slate-800 text-sm">
            {totalSum.toLocaleString()} {unit}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">المتوسط الحسابي للفترة:</span>
          <span className="font-bold font-sans text-slate-800 text-sm">
            {avgValue.toLocaleString()} {unit}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <span className="text-[11px] text-slate-500 block">أعلى نقطة ذروة مسجلة:</span>
          <span className="font-bold text-blue-700 text-sm">
            {maxPoint.label} ({maxPoint.formattedValue})
          </span>
        </div>
      </div>
    </div>
  );
}
