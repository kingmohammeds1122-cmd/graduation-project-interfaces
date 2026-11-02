"use client";

import React, { useMemo } from "react";

export default function NightDesertBackground() {
  // توليد 45 نجمة متلألئة بمواقع وأحجام وتأخيرات حركية عشوائية محسوبة بدقة
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      // توزيع النجوم في النصف العلوي والوسط من السماء
      const top = (i * 17) % 65; // 0% إلى 65%
      const left = (i * 23) % 98; // 0% إلى 98%
      const size = (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5);
      const isDiamond = i % 8 === 0;
      const opacity = 0.35 + ((i % 5) * 0.15); // 0.35 إلى 0.95
      const duration = 2.5 + ((i % 4) * 1.2); // 2.5s إلى 6.1s
      const delay = (i % 5) * 0.7; // 0s إلى 2.8s
      return { id: i, top, left, size, isDiamond, opacity, duration, delay };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. التدرج السماوي الليلي العميق */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020510] via-[#060c22] to-[#0a122e]" />

      {/* 2. الإضاءة المحيطية الناعمة (Ambient Nebula Glows) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-sky-500/15 rounded-full blur-[140px]" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[130px]" />
      <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px]" />

      {/* 3. النجوم المتلألئة في السماء (Twinkling Desert Stars) */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className={`absolute rounded-full transition-opacity ${
              star.isDiamond ? "text-sky-200" : "bg-white"
            }`}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.isDiamond ? undefined : `${star.size}px`,
              height: star.isDiamond ? undefined : `${star.size}px`,
              opacity: star.opacity,
              animation: `pulse ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          >
            {star.isDiamond && (
              <span className="text-[10px] leading-none select-none block -mt-1 -ml-1 text-cyan-200 drop-shadow-[0_0_6px_rgba(186,230,253,0.8)]">
                ✦
              </span>
            )}
          </span>
        ))}
      </div>

      {/* 4. القمر الضخم المتوهج في الأفق العلوي (The Giant Glowing Moon - Lunara) */}
      <div className="absolute top-[-30px] sm:top-[-45px] left-1/2 -translate-x-1/2 flex items-center justify-center">
        {/* هالة التوهج الجوي الكبرى (Outer Atmospheric Halo) */}
        <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-b from-sky-400/20 via-cyan-400/10 to-transparent blur-3xl pointer-events-none" />
        
        {/* حلقة التوهج المحيطية الأولى (Concentric Lunar Corona Ring) */}
        <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-sky-300/20 shadow-[0_0_90px_rgba(186,230,253,0.35)] pointer-events-none" />
        
        {/* حلقة التوهج المحيطية الثانية الأوسع */}
        <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-sky-400/10 pointer-events-none" />

        {/* قرص القمر المضيء وتفاصيل السطح القمري (Glowing Moon Disc with Crater Details) */}
        <div className="relative w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] shadow-[0_0_100px_rgba(255,255,255,0.65),0_0_40px_rgba(186,230,253,0.7)] overflow-hidden ring-1 ring-white/60">
          {/* ظلال الفوهات والتضاريس القمرية الطبيعية */}
          <div className="absolute top-8 left-10 w-14 h-14 rounded-full bg-slate-300/40 blur-[2px]" />
          <div className="absolute top-16 right-12 w-10 h-10 rounded-full bg-slate-300/35 blur-[2px]" />
          <div className="absolute bottom-10 left-16 w-16 h-16 rounded-full bg-slate-300/50 blur-[3px]" />
          <div className="absolute bottom-6 right-14 w-8 h-8 rounded-full bg-slate-300/40 blur-[1px]" />
          <div className="absolute top-24 left-24 w-6 h-6 rounded-full bg-slate-400/30 blur-[1px]" />
          
          {/* إضاءة القمر الزجاجية العلوية */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none" />
        </div>
      </div>

      {/* 5. كثبان الصحراء الليلية الساحرة في الأسفل (Layered Night Desert Sand Dunes) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-60 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            {/* تدرج الكثيب البعيد */}
            <linearGradient id="farDuneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111c3d" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#080e22" stopOpacity="0.95" />
            </linearGradient>

            {/* تدرج الكثيب المتوسط مع انعكاس ضوء القمر */}
            <linearGradient id="midDuneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c1430" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#050816" stopOpacity="1" />
            </linearGradient>

            {/* تدرج الكثيب القريب في المقدمة */}
            <linearGradient id="nearDuneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#080d20" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#02040b" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* الكثيب البعيد في الأفق (Far Dune with soft rim light) */}
          <path
            d="M0,180 C320,130 520,230 840,160 C1120,90 1320,180 1440,150 L1440,320 L0,320 Z"
            fill="url(#farDuneGrad)"
            stroke="rgba(147, 197, 253, 0.22)"
            strokeWidth="1.2"
          />

          {/* الكثيب المتوسط (Mid Dune with moonlight highlight) */}
          <path
            d="M0,230 C280,180 620,270 960,200 C1220,150 1360,240 1440,210 L1440,320 L0,320 Z"
            fill="url(#midDuneGrad)"
            stroke="rgba(186, 230, 253, 0.28)"
            strokeWidth="1.5"
          />

          {/* الكثيب القريب الراسخ في المقدمة (Near Dune) */}
          <path
            d="M0,270 C360,220 720,300 1080,240 C1280,210 1380,260 1440,250 L1440,320 L0,320 Z"
            fill="url(#nearDuneGrad)"
            stroke="rgba(224, 242, 254, 0.18)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 6. توهج ضبابي ناعم فوق رمال الصحراء السفلية */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#02040b] via-[#02040b]/80 to-transparent pointer-events-none" />
    </div>
  );
}
