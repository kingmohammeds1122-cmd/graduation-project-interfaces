/**
 * تعريفات أنواع شاشة المحادثة الذكية (Chat Types)
 */

export type ChatRole = "user" | "assistant";

export interface DocumentSource {
  id: string;
  documentName: string;
  pageNumber?: number;
  snippet?: string;
}

export interface ChatTableData {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  table?: ChatTableData;        // اختياري: يظهر فقط إذا وجد في بيانات الرد
  sources?: DocumentSource[];    // اختياري: يظهر فقط إذا وجدت مراجع مستندات في بيانات الرد
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
