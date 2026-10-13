import { ChatSession, QuickPrompt, ChatMessage } from "@/types/chat.types";

/**
 * أسئلة سريعة مقترحة لشاشة الترحيب في المحادثة الجديدة (عينات تجريبية)
 */
export const mockQuickPrompts: QuickPrompt[] = [
  {
    id: "qp-1",
    title: "نموذج استخراج من ملف",
    prompt: "كيف سيتم تلخيص المستندات المرفوعة بعد ربط محرك الـ RAG؟ (استفسار توضيحي)",
    category: "استفسارات عامة",
  },
  {
    id: "qp-2",
    title: "نموذج رد يتضمن جدولاً",
    prompt: "اعرض لي عينة جدول يوضح مؤشرات أداء افتراضية للواجهة",
    category: "عينات الجداول",
  },
  {
    id: "qp-3",
    title: "نموذج اقتباس مراجع المستندات",
    prompt: "كيف تظهر مراجع الصفحات والمستندات في أسفل إجابة المساعد؟",
    category: "المراجع والمصادر",
  },
  {
    id: "qp-4",
    title: "أنواع المصادر المدعومة",
    prompt: "ما هي مصادر البيانات المخطط دعم ربطها مستقبلاً في المنصة؟",
    category: "معلومات المنصة",
  },
];

/**
 * جلسات محادثة سابقة تجريبية (Mock Chat Sessions)
 * ملاحظة: كافة الأسئلة والردود والأرقام والملفات هنا هي عينات محاكاة بصرية فقط.
 */
export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "محادثة تجريبية: عينة استعراض جدول مؤشرات",
    updatedAt: "اليوم • 10:30 ص (افتراضي)",
    messageCount: 2,
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "اعرض لي عينة جدول يوضح مؤشرات أداء افتراضية للواجهة",
        timestamp: "10:29 ص",
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content:
          "أهلاً بك! هذا نموذج رد توضيحي يُظهر كيفية عرض الجداول الإحصائية المدمجة داخل واجهة المحادثة. لاحظ أن الأرقام أدناه هي عينات محاكاة افتراضية:",
        timestamp: "10:30 ص",
        isMockSample: true,
        table: {
          caption: "جدول افتراضي: نموذج توزيع مؤشرات العمليات (عينة توضيحية)",
          headers: ["المؤشر الافتراضي", "القيمة التقديرية", "حالة الفحص", "ملاحظة المحاكاة"],
          rows: [
            ["استفسارات مستودع المعرفة", "450 طلباً", "مكتمل", "عينة بيانات تجريبية"],
            ["متوسط سرعة الاستجابة المحاكاة", "1.2 ثانية", "طبيعي", "محاكاة وقت المعالجة"],
            ["دقة مطابقة السياق التقديرية", "96.5%", "مستقر", "نموذج توضيحي"],
          ],
        },
      },
    ],
  },
  {
    id: "session-2",
    title: "محادثة تجريبية: عينة رد مدعوم بمراجع مستندات",
    updatedAt: "أمس • 04:15 م (افتراضي)",
    messageCount: 2,
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "كيف تظهر مراجع الصفحات والمستندات في أسفل إجابة المساعد؟",
        timestamp: "04:14 م",
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content:
          "عند ربط محرك الـ RAG مستقبلاً، سيتم تذييل الإجابات ببطاقات مصادر المستندات المستند إليها. هذا نموذج افتراضي يبين شكل الاقتباس ورقم الصفحة:",
        timestamp: "04:15 م",
        isMockSample: true,
        sources: [
          {
            id: "src-1",
            documentName: "دليل_معايير_المنصة_الافتراضي.pdf",
            pageNumber: 8,
            snippet: "عينة اقتباس: تتضمن المنصة واجهة محادثة ذكية متوافقة مع شاشات الحاسوب والجوال...",
          },
          {
            id: "src-2",
            documentName: "مصفوفة_الحوكمة_التشغيلية_عينة.docx",
            pageNumber: 15,
            snippet: "عينة اقتباس: يُشار صراحة إلى حالة البيانات التجريبية لحين ربط خادم الـ API...",
          },
        ],
      },
    ],
  },
  {
    id: "session-3",
    title: "محادثة تجريبية: استفسار نصي توضيحي بسيط",
    updatedAt: "منذ 3 أيام (افتراضي)",
    messageCount: 2,
    messages: [
      {
        id: "msg-3-1",
        role: "user",
        content: "ما هي مصادر البيانات المخطط دعم ربطها مستقبلاً في المنصة؟",
        timestamp: "11:00 ص",
      },
      {
        id: "msg-3-2",
        role: "assistant",
        content:
          "مخطط مستقبلاً دعم ربط قواعد البيانات العلائقية (مثل PostgreSQL و MySQL)، وملفات المستندات الشائعة (PDF و Excel و CSV)، بالإضافة إلى واجهات الـ REST API لجمع البيانات في واجهة موحدة. (ملاحظة: هذا رد نصي نموذجي بدون جداول أو مراجع لتوضيح تنوع تنسيق الردود).",
        timestamp: "11:01 ص",
        isMockSample: true,
      },
    ],
  },
];

/**
 * توليد رد تجريبي على أي استفسار جديد يتم كتابته أثناء المحاكاة
 */
export function generateMockAssistantReply(userQuestion: string): ChatMessage {
  const isTableRequested =
    userQuestion.includes("جدول") ||
    userQuestion.includes("table") ||
    userQuestion.includes("أرقام") ||
    userQuestion.includes("مؤشرات");

  const isSourcesRequested =
    userQuestion.includes("مراجع") ||
    userQuestion.includes("مستند") ||
    userQuestion.includes("ملف") ||
    userQuestion.includes("مصدر");

  const now = new Date();
  const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: `تم استلام استفسارك التجريبي: «${userQuestion}» بنجاح. هذه إجابة محاكاة توضيحية في الواجهة لتجربة تجاوب صندوق المحادثة. سيتم ربط التوليد الحقيقي بنموذج الذكاء الاصطناعي وخادم FastAPI في المراحل اللاحقة.`,
    timestamp: timeString,
    isMockSample: true,
  };

  if (isTableRequested) {
    message.table = {
      caption: "جدول محاكاة: عينة نتائج تفاعلية لاستفسارك (افتراضي)",
      headers: ["البند المحاكى", "النتيجة التقديرية", "التصنيف الافتراضي"],
      rows: [
        ["عنصر تجريبي أ", "1,250 وحدة", "فئة تجريبية 1"],
        ["عنصر تجريبي ب", "840 وحدة", "فئة تجريبية 2"],
        ["عنصر تجريبي ج", "320 وحدة", "فئة تجريبية 3"],
      ],
    };
  }

  if (isSourcesRequested) {
    message.sources = [
      {
        id: `src-${Date.now()}-1`,
        documentName: "مستند_تجريبي_للمحاكاة.pdf",
        pageNumber: 3,
        snippet: "عينة نصية محاكاة تم استخراجها استرشادياً لتوضيح بطاقة المرجع.",
      },
    ];
  }

  return message;
}
