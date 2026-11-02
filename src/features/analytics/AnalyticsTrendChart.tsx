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
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-white/10 p-8 text-center text-slate-400 text-xs">
        لا توجد بيانات متاحة لهذا النطاق الزمني.
      </div>
    );
  }

  // حسابات الرسم البياني
  const values = points.map((p) => p.value);
  const rawMax = Math.max(...values, 10);
  const maxValue = Math.ceil(rawMax * 1.15);
  const totalSum = values.reduce((acc, v) => acc + v, 0);
  const avgValue = Math.round(totalSum / values.length);
  const maxPoint = points.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), points[0]);

  // إحداثيات الرسم البياني (SVG Coordinates)
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingX = 45;
  const paddingTop = 30;
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

  // توليد مسار الخط والانحناء السلس (Cubic Bezier Spline)
  const coordinates = points.map((p, idx) => ({ x: getX(idx), y: getY(p.value) }));

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

  // مسار المنطقة المظللة المتوهجة تحت الخط (Glowing Area Fill Path)
  const areaPathD = `${linePathD} L ${coordinates[coordinates.length - 1].x} ${
    paddingTop + chartHeight
  } L ${coordinates[0].x} ${paddingTop + chartHeight} Z`;

  // خطوط شبكة المحور الرأسي
  const yTicks = [0, Math.round(maxValue / 3), Math.round((maxValue * 2) / 3), maxValue];

  const activePoint = activePointIndex !== null ? points[activePointIndex] : null;
  const activeCoord = activePointIndex !== null ? coordinates[activePointIndex] : null;

  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* 1. ترويسة الرسم وأزرار التبديل */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              {periodLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description} • <span className="font-semibold text-slate-700 dark:text-slate-300">الوحدة: {unit}</span>
          </p>
        </div>

        {/* أزرار التبديل بين الرسم والجدول */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("chart")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "chart"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-2xs border border-slate-200/70 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-2xs border border-slate-200/70 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>عرض الجدول البديل</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. منطقة العرض الرئيسي: الرسم أو الجدول */}
      {viewMode === "chart" ? (
        <div className="space-y-3">
          <div className="relative w-full overflow-hidden bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-white/5 p-2 sm:p-4">
            {/* نافذة التلميح الزجاجية العائمة التفاعلية (Floating Glass Tooltip) */}
            {activePoint && activeCoord && (
              <div
                className="absolute z-20 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(activeCoord.x / svgWidth) * 100}%`,
                  top: `${(activeCoord.y / svgHeight) * 100 - 4}%`,
                }}
              >
                <div className="bg-slate-900/95 dark:bg-[#070B19]/95 text-white text-xs px-3 py-2 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl whitespace-nowrap space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
                    <span>{activePoint.label}</span>
                    <span className="font-mono text-blue-300 font-bold">
                      {Math.round((activePoint.value / rawMax) * 100)}% من الذروة
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 font-mono text-sm font-extrabold text-white">
                    <span>{activePoint.formattedValue}</span>
                    <span className="text-[10px] text-slate-400">{unit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* الرسم البياني SVG مع توهج المنحنى والمحاور */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-52 sm:h-64 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* التدرج اللوني المتوهج تحت المنحنى */}
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.38" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
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
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="currentColor"
                      className="text-slate-400 dark:text-slate-500 font-mono text-[9px]"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* المنطقة المظللة المتوهجة (Area Fill) */}
              <path d={areaPathD} fill="url(#trendGradient)" />

              {/* خط الاتجاه الرئيسي المتوهج (Glowing Line Stroke) */}
              <path
                d={linePathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowFilter)"
              />

              {/* نقاط البيانات التفاعلية (Data Points) */}
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
                      onMouseLeave={() => setActivePointIndex(null)}
                      onClick={() => setActivePointIndex(idx)}
                    />

                    {/* الدائرة المتوهجة عند التحويم */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isActive ? 6 : 3.5}
                      fill={isActive ? "#3b82f6" : "#ffffff"}
                      stroke="#2563eb"
                      strokeWidth={isActive ? "2.5" : "2"}
                      className="transition-all duration-150"
                      style={{
                        filter: isActive ? "drop-shadow(0 0 6px rgba(59,130,246,0.8))" : "none",
                      }}
                    />

                    {/* تسمية المحور الأفقي X */}
                    <text
                      x={coord.x}
                      y={paddingTop + chartHeight + 20}
                      textAnchor="middle"
                      fill="currentColor"
                      className={`select-none font-sans ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-500 dark:text-slate-400 font-normal"
                      }`}
                      fontSize={points.length > 8 ? "8" : "10"}
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold">
                <th className="p-3">الفترة / التاريخ</th>
                <th className="p-3">القيمة الرقمية</th>
                <th className="p-3">القيمة المنسقة</th>
                <th className="p-3">النسبة من الذروة ({maxPoint.formattedValue})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {points.map((p) => {
                const ratio = Math.round((p.value / rawMax) * 100);
                return (
                  <tr
                    key={p.periodKey}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{p.label}</td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{p.value}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{p.formattedValue}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{ratio}%</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/70 dark:border-white/5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">الإجمالي التراكمي للفترة:</span>
          <span className="font-bold font-mono text-slate-800 dark:text-white text-sm">
            {totalSum.toLocaleString()} {unit}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/70 dark:border-white/5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">المتوسط الحسابي للفترة:</span>
          <span className="font-bold font-mono text-slate-800 dark:text-white text-sm">
            {avgValue.toLocaleString()} {unit}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/70 dark:border-white/5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">أعلى نقطة ذروة مسجلة:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
            {maxPoint.label} ({maxPoint.formattedValue})
          </span>
        </div>
      </div>
    </div>
  );
}
