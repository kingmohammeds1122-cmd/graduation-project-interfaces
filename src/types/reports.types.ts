/**
 * تعريفات أنواع شاشة التقارير (Reports Types)
 */

export type ReportStatus = "ready" | "generating" | "failed";

export type ReportFormat = "PDF" | "XLSX" | "CSV" | "JSON" | "HTML";

export type ReportCategory = "financial" | "performance" | "operational" | "audit" | "custom";

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  categoryLabel: string;
  format: ReportFormat;
  size: string;
  createdAt: string;
  status: ReportStatus;
  statusLabel: string;
  generatedBy: string;
  details?: {
    scope: string;
    filtersApplied: string;
    summaryNotes: string;
    estimatedRows?: number;
    estimatedPages?: number;
  };
  isMock: boolean;
}

export interface ReportFilterOptions {
  searchQuery: string;
  categoryFilter: string;
  formatFilter: string;
  statusFilter: string;
}

export interface ReportsStats {
  total: number;
  ready: number;
  generating: number;
  failed: number;
}
