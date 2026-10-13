/**
 * تعريفات الأنواع لبيانات لوحة التحكم (Dashboard)
 */

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  subtext: string;
  changePercent?: string;
  changeType?: "positive" | "neutral" | "negative";
  category: "data-sources" | "documents" | "queries" | "status";
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "chat" | "document" | "source" | "report";
  status: "completed" | "processing" | "warning";
}

export interface RecentReportSummary {
  id: string;
  title: string;
  category: string;
  generatedAt: string;
  fileSize: string;
  status: "ready" | "pending";
}

export interface DashboardData {
  metrics: DashboardMetric[];
  recentActivities: RecentActivity[];
  recentReports: RecentReportSummary[];
  isMockData: boolean;
}
