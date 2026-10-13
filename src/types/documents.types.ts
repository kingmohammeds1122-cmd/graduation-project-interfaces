/**
 * تعريفات أنواع شاشة المستندات والمعرفة (Documents Types)
 */

export type DocumentStatus = "uploaded" | "processing" | "completed" | "failed";

export type DocumentFileType = "PDF" | "DOCX" | "XLSX" | "CSV" | "TXT";

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentFileType;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  description?: string;
  isMock: boolean;
}

export interface DocumentFilterOptions {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}
