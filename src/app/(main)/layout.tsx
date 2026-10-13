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
    <div className="min-h-screen bg-[#F8FAFC] flex" dir="rtl">
      {/* القائمة الجانبية (تدعم الحاسوب والدرج المنبثق في الهواتف) */}
      <Sidebar
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* منطقة المحتوى الرئيسية مع خلفية فاتحة ومريحة */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
