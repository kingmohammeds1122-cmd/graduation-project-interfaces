import { DocumentItem } from "@/types/documents.types";

/**
 * بيانات المستندات التجريبية المعزولة (Mock Documents)
 * ملاحظة هامة: كافة الملفات والأسماء والأحجام والحالات هنا هي عينات محاكاة بصرية،
 * ولا توجد ملفات حقيقية مخزنة أو معالجة على أي خادم.
 */
export const mockDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    name: "تقرير_الأداء_المالي_السنوي_2025.pdf",
    type: "PDF",
    size: "4.2 MB",
    uploadedAt: "2026-10-12 • 09:30 ص (محاكاة)",
    status: "completed",
    description: "عينة محاكاة لتقرير مالي مكتمل الفهرسة وجاهز للاستفسار عبر المحادثة.",
    isMock: true,
  },
  {
    id: "doc-2",
    name: "بيانات_المبيعات_التاريخية_Q3.xlsx",
    type: "XLSX",
    size: "2.8 MB",
    uploadedAt: "2026-10-11 • 02:15 م (محاكاة)",
    status: "completed",
    description: "عينة محاكاة لجدول بيانات مبيعات مكتمل المعالجة.",
    isMock: true,
  },
  {
    id: "doc-3",
    name: "دليل_سياسات_حوكمة_البيانات.docx",
    type: "DOCX",
    size: "1.1 MB",
    uploadedAt: "اليوم • 11:00 ص (محاكاة)",
    status: "processing",
    description: "عينة محاكاة لملف مستند قيد المعالجة الافتراضية حالياً.",
    isMock: true,
  },
  {
    id: "doc-4",
    name: "عينة_سجلات_العملاء_الجدد.csv",
    type: "CSV",
    size: "850 KB",
    uploadedAt: "اليوم • 11:45 ص (محاكاة)",
    status: "uploaded",
    description: "عينة محاكاة لملف تم رفعه حديثاً وبانتظار بدء المعالجة.",
    isMock: true,
  },
  {
    id: "doc-5",
    name: "مصفوفة_المخاطر_التشغيلية_المحدثة.pdf",
    type: "PDF",
    size: "3.5 MB",
    uploadedAt: "أمس • 04:20 م (محاكاة)",
    status: "failed",
    description: "عينة محاكاة لملف واجه خطأ افتراضياً أثناء المعالجة (لتجربة زر إعادة المحاولة).",
    isMock: true,
  },
  {
    id: "doc-6",
    name: "ملخص_المتطلبات_الفنية.txt",
    type: "TXT",
    size: "120 KB",
    uploadedAt: "2026-10-09 • 10:00 ص (محاكاة)",
    status: "completed",
    description: "عينة محاكاة لملف نصي عادي مكتمل الفهرسة.",
    isMock: true,
  },
];
