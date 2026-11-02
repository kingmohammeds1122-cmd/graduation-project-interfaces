"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function MainPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200"
      dir="rtl"
    >
      {/* القائمة الجانبية القابلة للطي (تدعم الحاسوب وشاشات الهواتف) */}
      <Sidebar
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
