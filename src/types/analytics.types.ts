/**
 * تعريفات أنواع شاشة التحليلات ومؤشرات الأداء (Analytics Types)
 */

export type AnalyticsTimeRange = "7d" | "30d" | "90d" | "12m";

export type AnalyticsMetricType = "all" | "queries" | "response_time" | "sources";

export interface AnalyticsFilterOptions {
  timeRange: AnalyticsTimeRange;
  metricType: AnalyticsMetricType;
}

export type TrendDirection = "up" | "down" | "neutral";
export type TrendSentiment = "positive" | "negative" | "neutral";

export interface AnalyticsKpiItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  changeRate: string;
  trendDirection: TrendDirection;
  trendSentiment: TrendSentiment;
  sentimentText: string; // نص وصفي بدلاً من الاعتماد على اللون فقط
  periodLabel: string;
  isMock: boolean;
}

export interface TrendDataPoint {
  periodKey: string;
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue: string;
}

export interface CategoryComparisonItem {
  id: string;
  categoryName: string;
  primaryValue: number;
  formattedValue: string;
  percentage: number;
  badgeLabel: string;
}

export interface DistributionSegment {
  id: string;
  name: string;
  count: number;
  formattedCount: string;
  percentage: number;
  colorName: string; // اسم وصفي للون
}

export interface AnalyticsDataSet {
  filters: AnalyticsFilterOptions;
  kpis: AnalyticsKpiItem[];
  trend: {
    title: string;
    description: string;
    unit: string;
    periodLabel: string;
    points: TrendDataPoint[];
  };
  categories: {
    title: string;
    description: string;
    unit: string;
    items: CategoryComparisonItem[];
  };
  distribution: {
    title: string;
    description: string;
    items: DistributionSegment[];
  };
  isMock: boolean;
}
