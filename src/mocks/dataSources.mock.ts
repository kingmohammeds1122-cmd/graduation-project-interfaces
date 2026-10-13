import { DataSource } from "@/types/dataSources.types";

/**
 * بيانات مصادر البيانات التجريبية المعزولة (Mock Data Sources)
 * ملاحظة هامة: كافة المصادر والجداول والأسماء والمؤشرات هنا هي عينات محاكاة واجهة بصرية،
 * ولا ترتبط بأي قواعد بيانات حقيقية أو خدمات سحابية خارجية.
 */
export const mockDataSources: DataSource[] = [
  {
    id: "ds-1",
    name: "قاعدة بيانات المبيعات المركزية (عينة)",
    type: "PostgreSQL",
    status: "connected",
    lastChecked: "اليوم • 10:15 ص (محاكاة)",
    recordCountEstimate: "45,200 سجل تقديري",
    description: "نموذج محاكاة لمصدر يمثل بيانات طلبات العملاء ومعاملات الفروع.",
    isMock: true,
    schema: [
      {
        tableName: "orders (الطلبات)",
        rowCountEstimate: "32,400 صف محاكى",
        columns: [
          { name: "order_id", type: "UUID", isPrimary: true, description: "معرف الطلب الفريد" },
          { name: "customer_id", type: "UUID", description: "معرف العميل المرتبط" },
          { name: "total_amount", type: "NUMERIC(10,2)", description: "قيمة الطلب الإجمالية" },
          { name: "order_status", type: "VARCHAR(20)", description: "حالة معالجة الطلب" },
          { name: "created_at", type: "TIMESTAMP", description: "تاريخ ووقت الإنشاء" },
        ],
      },
      {
        tableName: "customers (العملاء)",
        rowCountEstimate: "12,800 صف محاكى",
        columns: [
          { name: "customer_id", type: "UUID", isPrimary: true, description: "معرف العميل" },
          { name: "full_name", type: "VARCHAR(100)", description: "الاسم الكامل" },
          { name: "email_address", type: "VARCHAR(120)", description: "البريد الإلكتروني المرمز" },
          { name: "region", type: "VARCHAR(50)", description: "المنطقة الجغرافية" },
        ],
      },
    ],
  },
  {
    id: "ds-2",
    name: "نظام إدارة المخزون والمستودعات (عينة)",
    type: "MySQL",
    status: "connected",
    lastChecked: "اليوم • 09:30 ص (محاكاة)",
    recordCountEstimate: "18,400 سجل تقديري",
    description: "نموذج محاكاة لمصدر يمثل كميات الأصناف والمواقع وحركات التوريد.",
    isMock: true,
    schema: [
      {
        tableName: "inventory_items (الأصناف)",
        rowCountEstimate: "14,200 صف محاكى",
        columns: [
          { name: "item_code", type: "VARCHAR(30)", isPrimary: true, description: "رمز الصنف" },
          { name: "item_name", type: "VARCHAR(150)", description: "اسم المنتج" },
          { name: "quantity_on_hand", type: "INT", description: "الكمية المتوفرة حالياً" },
          { name: "reorder_level", type: "INT", description: "حد إعادة الطلب الأدنى" },
        ],
      },
      {
        tableName: "warehouses (المستودعات)",
        rowCountEstimate: "8 مستودعات",
        columns: [
          { name: "warehouse_id", type: "INT", isPrimary: true, description: "معرف المستودع" },
          { name: "warehouse_name", type: "VARCHAR(80)", description: "اسم المستودع" },
          { name: "city", type: "VARCHAR(50)", description: "المدينة" },
        ],
      },
    ],
  },
  {
    id: "ds-3",
    name: "واجهة فواتير الدفع الإلكتروني (عينة)",
    type: "REST API",
    status: "syncing",
    lastChecked: "منذ 15 دقيقة (محاكاة)",
    recordCountEstimate: "8,900 سجل تقديري",
    description: "نموذج محاكاة لمصدر يمثل مدخلات الدفع عبر واجهات برمجية خارجية.",
    isMock: true,
    schema: [
      {
        tableName: "invoices_endpoint (/api/v1/invoices)",
        rowCountEstimate: "8,900 سجل متدفق",
        columns: [
          { name: "invoice_number", type: "STRING", isPrimary: true, description: "رقم الفاتورة" },
          { name: "payment_gateway", type: "STRING", description: "بوابة الدفع" },
          { name: "currency", type: "STRING(3)", description: "العملة الافتراضية" },
          { name: "sync_timestamp", type: "DATETIME", description: "وقت المزامنة الأخيرة" },
        ],
      },
    ],
  },
  {
    id: "ds-4",
    name: "ملف بيانات العملاء المحتملين التاريخي (عينة)",
    type: "CSV / Excel",
    status: "disconnected",
    lastChecked: "أمس • 02:00 م (محاكاة)",
    recordCountEstimate: "3,150 سجل تقديري",
    description: "نموذج محاكاة لملف بيانات مجدول غير متصل تلقائياً ويتطلب تحديثاً يدوياً.",
    isMock: true,
    schema: [
      {
        tableName: "leads_dataset.xlsx",
        rowCountEstimate: "3,150 سطر محاكى",
        columns: [
          { name: "lead_id", type: "INT", isPrimary: true, description: "الرقم التسلسلي" },
          { name: "company_name", type: "TEXT", description: "اسم المنشأة" },
          { name: "contact_channel", type: "TEXT", description: "قناة التواصل" },
          { name: "status_tag", type: "TEXT", description: "تصنيف الحالة" },
        ],
      },
    ],
  },
  {
    id: "ds-5",
    name: "مستودع السجلات التشغيلية والأنشطة (عينة)",
    type: "MongoDB",
    status: "error",
    lastChecked: "منذ ساعتين (محاكاة)",
    recordCountEstimate: "24,000 سجل تقديري",
    description: "نموذج محاكاة لمصدر يوضح ظهور حالة التنبيه/الخطأ عند انقطاع الاتصال الافتراضي.",
    isMock: true,
    schema: [
      {
        tableName: "audit_logs (السجلات)",
        rowCountEstimate: "24,000 وثيقة محاكاة",
        columns: [
          { name: "_id", type: "ObjectId", isPrimary: true, description: "معرف الوثيقة" },
          { name: "event_type", type: "String", description: "نوع الحدث المسجل" },
          { name: "user_handle", type: "String", description: "اسم المستخدم المرجعي" },
          { name: "error_trace", type: "String", description: "رسالة فحص الخطأ التجريبية" },
        ],
      },
    ],
  },
];
