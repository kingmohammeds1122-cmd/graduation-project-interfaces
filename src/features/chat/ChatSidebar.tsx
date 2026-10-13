"use client";

import React from "react";
import { MessageSquare, Plus, Clock, X, Sparkles } from "lucide-react";
import { ChatSession } from "@/types/chat.types";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  isOpenOnMobile,
  onCloseMobile,
}: ChatSidebarProps) {
  const content = (
    <div className="h-full flex flex-col bg-white border-l border-slate-200/90 w-72 max-w-full select-none">
      {/* 1. ترويسة قائمة المحادثات وزر محادثة جديدة */}
      <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-800">سجل المحادثات التجريبية</h3>
          </div>
          {/* زر إغلاق القائمة في الهواتف */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="إغلاق سجل المحادثات"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* زر بدء محادثة جديدة */}
        <button
          type="button"
          onClick={() => {
            onNewChat();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>بدء محادثة جديدة</span>
        </button>
      </div>

      {/* 2. قائمة الجلسات السابقة التجريبية */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 tracking-wider">
          جلسات سابقة (عينة محاكاة)
        </div>

        {sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            لا توجد جلسات سابقة مسجلة
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = activeSessionId === session.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  onSelectSession(session);
                  onCloseMobile();
                }}
                className={`w-full text-right p-3 rounded-xl transition-all border block cursor-pointer ${
                  isActive
                    ? "bg-blue-50 border-blue-200 text-blue-900 shadow-2xs font-semibold"
                    : "bg-white hover:bg-slate-50 border-transparent hover:border-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-xs font-bold block truncate leading-tight">
                      {session.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{session.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 3. شريط توضيحي سفلي للشفافية */}
      <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 shrink-0">
        <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-violet-500" />
          <span>المحادثات مخزنة محلياً للعرض التجريبي</span>
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. العرض المكتبي الثابت على الحاسوب والأجهزة اللوحية (Desktop) */}
      <div className="hidden md:block shrink-0 h-full">{content}</div>

      {/* 2. درج منبثق مخصص لسجل محادثات الشات فقط على الهاتف (Chat Mobile Drawer) */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
