import { DashboardData } from "@/types/dashboard.types";

/**
 * بيانات تجريبية معزولة (Mock Data) للوحة التحكم
 * ملاحظة هامة: جميع الأرقام والأسماء هنا هي بيانات محاكاة بصرية فقط (Mock)،
 * ولا تعبر عن اتصال فعلي بقواعد بيانات أو استجابة حقيقية من الخادم.
 */
export const mockDashboardData: DashboardData = {
  isMockData: true,
  metrics: [
    {
      id: "sources",
      title: "مصادر البيانات (محاكاة)",
      value: "4 مصادر",
      subtext: "بيانات تجريبية لنموذج الربط المستقبلي",
      changePercent: "عينة تجريبية",
      changeType: "neutral",
      category: "data-sources",
    },
    {
      id: "documents",
      title: "المستندات والمعرفة (محاكاة)",
      value: "128 ملفاً",
      subtext: "أرقام محاكاة لواجهة مستودع المعرفة",
      changePercent: "عينة تجريبية",
      changeType: "neutral",
      category: "documents",
    },
    {
      id: "ai_queries",
      title: "استفسارات المساعد الذكي (محاكاة)",
      value: "1,420",
      subtext: "إحصائية افتراضية لتوضيح عرض حجم التفاعل",
      changePercent: "عينة تجريبية",
      changeType: "neutral",
      category: "queries",
    },
    {
      id: "sync_rate",
      title: "كفاءة المزامنة (تقدير محاكى)",
      value: "99.4% (محاكاة)",
      subtext: "مؤشر افتراضي للعرض فقط؛ لا يوجد فحص خادم فعلي",
      changePercent: "غير متصل فعلياً",
      changeType: "neutral",
      category: "status",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      title: "استفسار تجريبي عبر المحادثة الذكية",
      description: "طلب محاكاة: «تحليل مقارن لأداء المبيعات للربع الثالث»",
      timestamp: "منذ 15 دقيقة (عينة)",
      type: "chat",
      status: "completed",
    },
    {
      id: "act-2",
      title: "اكتمال معالجة ملف افتراضي",
      description: "عينة مستند: تقرير_الميزانية_السنوية_2025.pdf",
      timestamp: "منذ ساعة (عينة)",
      type: "document",
      status: "completed",
    },
    {
      id: "act-3",
      title: "فحص دوري افتراضي لمصدر بيانات",
      description: "محاكاة اتصال قاعدة بيانات PostgreSQL (المخزون الرئيسي)",
      timestamp: "منذ 3 ساعات (عينة)",
      type: "source",
      status: "completed",
    },
    {
      id: "act-4",
      title: "ملف قيد المعالجة التوضيحية",
      description: "عينة مستند: مصفوفة_المخاطر_التشغيلية.xlsx",
      timestamp: "منذ 5 ساعات (عينة)",
      type: "document",
      status: "processing",
    },
  ],
  recentReports: [
    {
      id: "rep-1",
      title: "تقرير الأداء المالي الربعي Q3 (عينة)",
      category: "تحليلات مالية",
      generatedAt: "2026-10-12 (تاريخ افتراضي)",
      fileSize: "2.4 MB (محاكاة)",
      status: "ready",
    },
    {
      id: "rep-2",
      title: "مؤشرات نمو العملاء والاحتفاظ (عينة)",
      category: "ذكاء تسويقي",
      generatedAt: "2026-10-10 (تاريخ افتراضي)",
      fileSize: "1.8 MB (محاكاة)",
      status: "ready",
    },
    {
      id: "rep-3",
      title: "ملخص الكفاءة التشغيلية للمصادر (عينة)",
      category: "إدارة البيانات",
      generatedAt: "2026-10-08 (تاريخ افتراضي)",
      fileSize: "950 KB (محاكاة)",
      status: "ready",
    },
  ],
};
