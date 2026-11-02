"use client";

import React, { useState, useRef, useCallback } from "react";

export type GlowColor = "blue" | "purple" | "emerald" | "cyan" | "amber" | "rose";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: GlowColor;
  className?: string;
  interactive?: boolean;
}

const GLOW_COLOR_MAP: Record<
  GlowColor,
  {
    borderGlow: string;
    ambientGlow: string;
    accentRing: string;
  }
> = {
  blue: {
    borderGlow: "rgba(59, 130, 246, 0.4)",
    ambientGlow: "rgba(37, 99, 235, 0.08)",
    accentRing: "group-hover:border-blue-400/50 dark:group-hover:border-blue-500/50",
  },
  purple: {
    borderGlow: "rgba(139, 92, 246, 0.45)",
    ambientGlow: "rgba(124, 58, 237, 0.08)",
    accentRing: "group-hover:border-purple-400/50 dark:group-hover:border-purple-500/50",
  },
  emerald: {
    borderGlow: "rgba(16, 185, 129, 0.4)",
    ambientGlow: "rgba(5, 150, 105, 0.08)",
    accentRing: "group-hover:border-emerald-400/50 dark:group-hover:border-emerald-500/50",
  },
  cyan: {
    borderGlow: "rgba(6, 182, 212, 0.4)",
    ambientGlow: "rgba(8, 145, 178, 0.08)",
    accentRing: "group-hover:border-cyan-400/50 dark:group-hover:border-cyan-500/50",
  },
  amber: {
    borderGlow: "rgba(245, 158, 11, 0.4)",
    ambientGlow: "rgba(217, 119, 6, 0.08)",
    accentRing: "group-hover:border-amber-400/50 dark:group-hover:border-amber-500/50",
  },
  rose: {
    borderGlow: "rgba(244, 63, 94, 0.4)",
    ambientGlow: "rgba(225, 29, 72, 0.08)",
    accentRing: "group-hover:border-rose-400/50 dark:group-hover:border-rose-500/50",
  },
};

export default function GlowCard({
  children,
  glowColor = "blue",
  className = "",
  interactive = true,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const colorConfig = GLOW_COLOR_MAP[glowColor] || GLOW_COLOR_MAP.blue;

  return (
    <div
      ref={cardRef}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      className={`group relative rounded-2xl transition-all duration-300 ${
        interactive ? "hover:-translate-y-1 hover:shadow-xl" : ""
      } ${className}`}
      {...props}
    >
      {/* 1. طبقة التوهج المتتبع للماوس على الحواف والزوايا (Mouse-Tracking Glowing Border) */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${colorConfig.borderGlow}, transparent 70%)`
            : "transparent",
        }}
      />

      {/* 2. طبقة الهالة المحيطية الخفيفة داخل الكارد (Inner Ambient Glow) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${colorConfig.ambientGlow}, transparent 80%)`
            : "transparent",
        }}
      />

      {/* 3. هيكل البطاقة الزجاجي الداخلي (Glassmorphic Surface) */}
      <div
        className={`relative z-10 w-full h-full rounded-2xl p-5 border transition-all duration-300 ${colorConfig.accentRing} bg-white/95 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between`}
      >
        {children}
      </div>
    </div>
  );
}
