"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ChatSession, ChatMessage } from "@/types/chat.types";
import {
  fetchChatSessions,
  fetchQuickPrompts,
  sendChatMessage,
} from "@/services/chat.service";
import ChatSidebar from "@/features/chat/ChatSidebar";
import ChatWelcomeScreen from "@/features/chat/ChatWelcomeScreen";
import ChatMessageItem from "@/features/chat/ChatMessageItem";
import ChatInput from "@/features/chat/ChatInput";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<Awaited<ReturnType<typeof fetchQuickPrompts>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string>("");
  const [isChatSidebarMobileOpen, setIsChatSidebarMobileOpen] = useState(false);
  const [forceErrorMode, setForceErrorMode] = useState(false);
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

  // إرسال رسالة
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    setLastUserQuestion(text);
    setIsLoading(true);

    // إضافة رسالة المستخدم فورياً للواجهة
    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const optimisticUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const response = await sendChatMessage(text, messages, {
        forceError: forceErrorMode,
        delayMs: 800,
      });

      // إضافة رد المساعد الذكي
      setMessages((prev) => [...prev, response.assistantMessage]);

      // تحديث أو إنشاء الجلسة في القائمة التجريبية
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
          updatedAt: "الآن (عينة)",
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
        setError("تعذر استلام الرد التجريبي، يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة المحاولة عند حدوث خطأ
  const handleRetry = () => {
    if (lastUserQuestion) {
      setError(null);
      handleSendMessage(lastUserQuestion);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs relative">
      {/* 1. قائمة المحادثات السابقة (داخل صفحة الشات فقط) */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSession?.id || null}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        isOpenOnMobile={isChatSidebarMobileOpen}
        onCloseMobile={() => setIsChatSidebarMobileOpen(false)}
      />

      {/* 2. منطقة المحادثة التفاعلية الرئيسية */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40">
        {/* أ. شريط ترويسة المحادثة العلوي */}
        <div className="h-14 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* زر فتح سجل المحادثات على الهاتف (منفصل وواضح عن القائمة الرئيسية) */}
            <button
              type="button"
              onClick={() => setIsChatSidebarMobileOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="فتح سجل المحادثات السابقة"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>السجل ({sessions.length})</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0"></span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {activeSession ? activeSession.title : "محادثة جديدة"}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 hidden sm:inline-flex">
                محاكاة AI
              </span>
            </div>
          </div>

          {/* أدوات الترويسة وأدوات التطوير المخصصة لبيئة dev فقط */}
          <div className="flex items-center gap-2">
            {/* أداة محاكاة الخطأ (تظهر في بيئة التطوير فقط) */}
            {process.env.NODE_ENV === "development" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDevControls(!showDevControls)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    forceErrorMode
                      ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                  title="أدوات اختبار الدردشة للمطورين"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">
                    {forceErrorMode ? "وضع الخطأ نشط" : "اختبار"}
                  </span>
                </button>

                {showDevControls && (
                  <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-slate-900 text-slate-200 rounded-xl shadow-xl border border-slate-800 z-50 text-xs space-y-2">
                    <span className="font-bold block text-white text-[11px]">
                      أدوات اختبار الدردشة (Dev):
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={forceErrorMode}
                        onChange={(e) => setForceErrorMode(e.target.checked)}
                        className="rounded accent-rose-600"
                      />
                      <span>محاكاة خطأ في الرد القادم</span>
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="بدء محادثة جديدة"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">محادثة جديدة</span>
              </button>
            )}
          </div>
        </div>

        {/* ب. منطقة رسائل المحادثة */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* حالة المحادثة الجديدة: شاشة الترحيب والأسئلة المقترحة */}
          {messages.length === 0 ? (
            <ChatWelcomeScreen
              prompts={quickPrompts}
              onSelectPrompt={handleSendMessage}
            />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}

              {/* مؤشر الانتظار ومعالجة الرد التجريبي */}
              {isLoading && (
                <div className="flex items-start gap-3 max-w-4xl mr-auto animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-xs border border-slate-200/90 p-4 shadow-2xs space-y-2 text-right">
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>المساعد الذكي يجهز الرد التجريبي...</span>
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* حالة الخطأ مع خيار إعادة المحاولة */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                  {lastUserQuestion && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shrink-0 cursor-pointer"
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

        {/* ج. شريط الإدخال السفلي الثابت */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200/90 shrink-0">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
