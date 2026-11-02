/**
 * خدمة المحادثة الذكية ومساعد الذكاء الاصطناعي (Chat Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بنقاط نهاية الـ AI في FastAPI.
 */

import {
  ChatSession,
  QuickPrompt,
  ChatMessage,
  AskQuestionResponse,
  ChatScope,
} from "@/types/chat.types";
import {
  mockChatSessions,
  mockQuickPrompts,
  generateMockAssistantReply,
} from "@/mocks/chat.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

export async function fetchChatSessions(): Promise<ChatSession[]> {
  if (USE_MOCK_API) {
    return [...mockChatSessions];
  }

  return await apiRequest<ChatSession[]>(API_ENDPOINTS.AI_CHAT.CONVERSATIONS, {
    method: "GET",
  });
}

export async function fetchQuickPrompts(): Promise<QuickPrompt[]> {
  // تظل الأسئلة المقترحة متاحة محلياً كقوالب سريعة للمستخدم
  return [...mockQuickPrompts];
}

/**
 * الدالة القياسية المعتمدة في الوثيقة لإرسال سؤال للذكاء الاصطناعي (askQuestion)
 */
export async function askQuestion(
  question: string,
  conversationId?: string,
  scope: ChatScope = "all"
): Promise<AskQuestionResponse> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const mockReply = generateMockAssistantReply(question.trim(), scope);
    return {
      answer: mockReply.content,
      conversation_id: conversationId || `conv-${Date.now()}`,
      sources: mockReply.sources,
      table: mockReply.table,
      insights: mockReply.insights,
      reasoningSteps: mockReply.reasoningSteps,
      partialError: mockReply.partialError,
    };
  }

  return await apiRequest<AskQuestionResponse>(API_ENDPOINTS.AI_CHAT.ASK, {
    method: "POST",
    body: JSON.stringify({
      question: question.trim(),
      conversation_id: conversationId,
      scope,
    }),
  });
}

/**
 * دالة إرسال رسالة المحادثة المتوافقة مع واجهة مساحة العمل التحليلية
 */
export async function sendChatMessage(
  question: string,
  currentMessages: ChatMessage[],
  options: {
    forceError?: boolean;
    delayMs?: number;
    conversationId?: string;
    scope?: ChatScope;
  } = {}
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const { forceError = false, delayMs = 800, conversationId, scope = "all" } = options;

  if (USE_MOCK_API) {
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
      scope,
    };

    const assistantMessage = generateMockAssistantReply(question.trim(), scope);

    return {
      userMessage,
      assistantMessage,
    };
  }

  // في الوضع الفعلي: استدعاء askQuestion وإرجاع كائني الرسالتين
  const now = new Date();
  const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    content: question.trim(),
    timestamp: timeString,
    scope,
  };

  const response = await askQuestion(question, conversationId, scope);

  const assistantMessage: ChatMessage = {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: response.answer,
    timestamp: timeString,
    scope,
    sources: response.sources,
    table: response.table,
    insights: response.insights,
    reasoningSteps: response.reasoningSteps,
    partialError: response.partialError,
  };

  return {
    userMessage,
    assistantMessage,
  };
}
