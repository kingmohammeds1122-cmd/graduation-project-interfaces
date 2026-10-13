import { ChatSession, QuickPrompt, ChatMessage } from "@/types/chat.types";
import {
  mockChatSessions,
  mockQuickPrompts,
  generateMockAssistantReply,
} from "@/mocks/chat.mock";

/**
 * خدمة المحادثة الذكية (Chat Service)
 * معزولة ومستقلة تماماً تقرأ محلياً من ملف الـ Mock وتُرجع وعوداً (Promises)،
 * جاهزة للاستبدال مستقبلاً بدوال fetch لـ FastAPI دون تعديل مكونات الواجهة.
 */

export async function fetchChatSessions(): Promise<ChatSession[]> {
  // محاكاة تأخير زمني خفيف لسرعة الاستجابة
  return [...mockChatSessions];
}

export async function fetchQuickPrompts(): Promise<QuickPrompt[]> {
  return [...mockQuickPrompts];
}

export async function sendChatMessage(
  question: string,
  currentMessages: ChatMessage[],
  options: { forceError?: boolean; delayMs?: number } = {}
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const { forceError = false, delayMs = 600 } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (forceError) {
    throw new Error("تعذر إرسال السؤال التجريبي أو توليد الرد، يرجى إعادة المحاولة.");
  }

  const now = new Date();
  const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    content: question.trim(),
    timestamp: timeString,
  };

  const assistantMessage = generateMockAssistantReply(question.trim());

  return {
    userMessage,
    assistantMessage,
  };
}
