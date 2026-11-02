/**
 * تعريفات أنواع شاشة المحادثة الذكية (Chat Types)
 * متوافقة مع مساحة العمل التحليلية المتقدمة (Advanced BI Chat Workspace).
 */

export type ChatRole = "user" | "assistant";

export type ChatScope = "all" | "databases" | "documents";

export interface DocumentSource {
  id: string;
  documentName: string;
  pageNumber?: number;
  snippet?: string;
  confidence?: string;
}

export interface ChatTableData {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}

export interface ChatInsight {
  title: string;
  value?: string;
  description: string;
  type?: "positive" | "warning" | "neutral" | "info";
}

export interface ReasoningStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed";
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  table?: ChatTableData;             // اختياري: بيانات جدولية
  sources?: DocumentSource[];         // اختياري: مراجع المستندات والمصادر (RAG)
  insights?: ChatInsight[];           // اختياري: بطاقات الرؤى والتحليلات الأساسية
  reasoningSteps?: ReasoningStep[];   // اختياري: مسار تفكير الوكيل
  scope?: ChatScope;                  // نطاق الاستفسار المعتمد
  partialError?: string;              // تنبيه في حال وجود نتيجة جزئية
  isMockSample?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  messages: ChatMessage[];
}

export interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
}

export interface AskQuestionRequest {
  question: string;
  conversation_id?: string;
  source_ids?: string[];
  scope?: ChatScope;
}

export interface AskQuestionResponse {
  answer: string;
  conversation_id: string;
  sources?: DocumentSource[];
  table?: ChatTableData;
  insights?: ChatInsight[];
  reasoningSteps?: ReasoningStep[];
  partialError?: string;
}
