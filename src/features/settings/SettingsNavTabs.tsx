"use client";

import React from "react";
import { User, Palette, Bell, Shield } from "lucide-react";
import { SettingsTab } from "@/types/settings.types";

interface SettingsNavTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "الملف الشخصي والمؤسسة", icon: User },
  { id: "preferences", label: "تفضيلات العرض والمظهر", icon: Palette },
  { id: "notifications", label: "الإشعارات والتنبيهات", icon: Bell },
  { id: "security_overview", label: "الأمان ونظرة الجلسة", icon: Shield },
];

export default function SettingsNavTabs({
  activeTab,
  onTabChange,
}: SettingsNavTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
