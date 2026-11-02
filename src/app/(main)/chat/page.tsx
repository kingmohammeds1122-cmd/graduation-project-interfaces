"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  Database,
  Globe,
  FileText,
} from "lucide-react";
import { ChatSession, ChatMessage, ChatScope } from "@/types/chat.types";
import {
  fetchChatSessions,
  fetchQuickPrompts,
  sendChatMessage,
} from "@/services/chat.service";
import ChatSidebar from "@/features/chat/ChatSidebar";
import ChatWelcomeScreen from "@/features/chat/ChatWelcomeScreen";
import ChatMessageItem from "@/features/chat/ChatMessageItem";
import ChatInput from "@/features/chat/ChatInput";
import ChatReasoningStepper from "@/features/chat/ChatReasoningStepper";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<Awaited<ReturnType<typeof fetchQuickPrompts>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string>("");
  const [lastScope, setLastScope] = useState<ChatScope>("all");
  const [isChatSidebarMobileOpen, setIsChatSidebarMobileOpen] = useState(false);
  const [forceErrorMode, setForceErrorMode] = useState(false);
  const [forcePartialMode, setForcePartialMode] = useState(false);
  const [showDevControls, setShowDevControls] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحميل البيانات الأولية للخدمة عند فتح الصفحة
  useEffect(() => {
    let isMounted = true;

    async function loadInitialChatData() {
      try {
        const [loadedSessions, loadedPrompts] = await Promise.all([
          fetchChatSessions(),
          fetchQuickPrompts(),
        ]);
        if (isMounted) {
          setSessions(loadedSessions);
          setQuickPrompts(loadedPrompts);
        }
      } catch {
        if (isMounted) {
          setError("تعذر تحميل سجل المحادثات التجريبية.");
        }
      }
    }

    loadInitialChatData();
    return () => {
      isMounted = false;
    };
  }, []);

  // التمرير التلقائي لأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // اختيار جلسة محادثة سابقة
  const handleSelectSession = (session: ChatSession) => {
    setActiveSession(session);
    setMessages(session.messages);
    setError(null);
  };

  // بدء محادثة جديدة
  const handleNewChat = () => {
    setActiveSession(null);
    setMessages([]);
    setError(null);
    setLastUserQuestion("");
  };

  // إرسال استفسار تحليلي جديد
  const handleSendMessage = async (text: string, scope: ChatScope = "all") => {
    if (!text.trim() || isLoading) return;

    setError(null);
    setLastUserQuestion(text);
    setLastScope(scope);
    setIsLoading(true);

    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const optimisticUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: timeString,
      scope,
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const queryText = forcePartialMode ? `${text} (جزئي)` : text;

      const response = await sendChatMessage(queryText, messages, {
        forceError: forceErrorMode,
        delayMs: 1400,
        scope,
      });

      setMessages((prev) => [...prev, response.assistantMessage]);

      if (activeSession) {
        const updated = {
          ...activeSession,
          messages: [...activeSession.messages, optimisticUserMsg, response.assistantMessage],
          messageCount: activeSession.messageCount + 2,
        };
        setActiveSession(updated);
        setSessions((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        const newSessionId = `session-${Date.now()}`;
        const newSession: ChatSession = {
          id: newSessionId,
          title: text.length > 28 ? `${text.substring(0, 28)}...` : text,
          updatedAt: "الآن (تحليل حي)",
          messageCount: 2,
          messages: [optimisticUserMsg, response.assistantMessage],
        };
        setActiveSession(newSession);
        setSessions((prev) => [newSession, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("تعذر استلام الرد التحليلي، يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserQuestion) {
      setError(null);
      handleSendMessage(lastUserQuestion, lastScope);
    }
  };

  const getActiveScopeBadge = () => {
    switch (lastScope) {
      case "databases":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Database className="w-2.5 h-2.5" />
            <span>قواعد البيانات</span>
          </span>
        );
      case "documents":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FileText className="w-2.5 h-2.5" />
            <span>المستندات</span>
          </span>
        );
      case "all":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <Globe className="w-2.5 h-2.5" />
            <span>كافة المصادر</span>
          </span>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xs relative text-slate-800 dark:text-slate-100">
      {/* 1. قائمة المحادثات السابقة والتحليلات */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSession?.id || null}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        isOpenOnMobile={isChatSidebarMobileOpen}
        onCloseMobile={() => setIsChatSidebarMobileOpen(false)}
      />

      {/* 2. مساحة العمل التحليلية الرئيسية (BI Workspace) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-black/20">
        
        {/* أ. شريط ترويسة مساحة العمل */}
        <div className="h-14 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* زر فتح سجل المحادثات على الهاتف */}
            <button
              type="button"
              onClick={() => setIsChatSidebarMobileOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              aria-label="فتح سجل المحادثات السابقة"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>السجل ({sessions.length})</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 animate-pulse"></span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-sans">
                {activeSession ? activeSession.title : "مساحة عمل تحليلية جديدة"}
              </h2>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                  AI Agent Planner
                </span>
                {getActiveScopeBadge()}
              </div>
            </div>
          </div>

          {/* أدوات الترويسة وأدوات التطوير */}
          <div className="flex items-center gap-2">
            {process.env.NODE_ENV === "development" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDevControls(!showDevControls)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    forceErrorMode || forcePartialMode
                      ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                  title="أدوات اختبار حالات مساحة العمل"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">أدوات الاختبار</span>
                </button>

                {showDevControls && (
                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-slate-200 rounded-xl shadow-xl border border-slate-800 z-50 text-xs space-y-2.5">
                    <span className="font-bold block text-white text-[11px] pb-1 border-b border-slate-800">
                      محاكاة سيناريوهات الاستجابة:
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={forcePartialMode}
                        onChange={(e) => setForcePartialMode(e.target.checked)}
                        className="rounded accent-amber-600"
                      />
                      <span>محاكاة نتيجة جزئية (تنبيه المخطط)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={forceErrorMode}
                        onChange={(e) => setForceErrorMode(e.target.checked)}
                        className="rounded accent-rose-600"
                      />
                      <span>محاكاة خطأ اتصال بالخادم</span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* زر بدء محادثة جديدة */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleNewChat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="بدء استفسار جديد"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">استفسار جديد</span>
              </button>
            )}
          </div>
        </div>

        {/* ب. منطقة رسائل ومساحة عمل المحادثة */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.length === 0 ? (
            <ChatWelcomeScreen
              prompts={quickPrompts}
              onSelectPrompt={(text) => handleSendMessage(text, "all")}
            />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}

              {/* 1. شريط مراحل تفكير الوكيل الذكي (AI Reasoning Stepper) أثناء التحميل */}
              {isLoading && (
                <div className="w-full flex items-start gap-3 sm:gap-4 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/25 mt-1">
                    <Sparkles className="w-4.5 h-4.5 animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ChatReasoningStepper
                      isLiveLoading={true}
                      scope={lastScope}
                    />
                  </div>
                </div>
              )}

              {/* حالة الخطأ مع خيار إعادة المحاولة */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                  {lastUserQuestion && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة المحاولة</span>
                    </button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ج. شريط الإدخال ومحدد نطاق المعرفة السفلي */}
        <div className="p-3 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/90 dark:border-white/10 shrink-0">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
