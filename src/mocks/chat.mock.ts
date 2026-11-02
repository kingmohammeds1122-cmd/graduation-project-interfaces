import {
  ChatSession,
  QuickPrompt,
  ChatMessage,
  ChatScope,
  ReasoningStep,
} from "@/types/chat.types";

/**
 * أسئلة سريعة مقترحة لشاشة الترحيب في المحادثة الجديدة (عينات تجريبية)
 */
export const mockQuickPrompts: QuickPrompt[] = [
  {
    id: "qp-1",
    title: "تحليل نمو الإيرادات والأداء",
    prompt: "ما هو ملخص نمو الإيرادات التشغيلية مقارنة بالربع السابق وفق البيانات المعرفة؟",
    category: "التحليلات والمؤشرات",
  },
  {
    id: "qp-2",
    title: "مقارنة مؤشرات قواعد البيانات",
    prompt: "اعرض لي عينة جدول يوضح مؤشرات أداء مصادر البيانات المركزية مع الرؤى الأساسية",
    category: "عينات الجداول والبيانات",
  },
  {
    id: "qp-3",
    title: "استنطاق المستندات وقاعدة المعرفة",
    prompt: "ما هي أهم بنود دليل الحوكمة وسياسة استبقاء البيانات مع ذكر مراجع الصفحات؟",
    category: "المراجع والمستندات",
  },
  {
    id: "qp-4",
    title: "فحص حالة الربط ومصادر البيانات",
    prompt: "ما هي مصادر البيانات المتصلة حالياً وحجم السجلات المقدرة لكل مصدر؟",
    category: "حوكمة المنصة",
  },
];

const STANDARD_REASONING_STEPS: ReasoningStep[] = [
  {
    id: "step-1",
    title: "1. فهم وتحليل الاستفسار المؤسسي",
    description: "تفكيك السؤال واستخراج الكلمات المفتاحية والمؤشرات المطلوبة",
    status: "completed",
  },
  {
    id: "step-2",
    title: "2. استعلام مصادر البيانات واسترجاع المستندات",
    description: "مطابقة فهارس RAG المعرفية واستعلام جداول قواعد البيانات المعتمدة",
    status: "completed",
  },
  {
    id: "step-3",
    title: "3. توليد التحليل وصياغة الرؤى",
    description: "تلخيص النتائج، استخراج الرؤى الأساسية، وإعداد الجداول والمراجع",
    status: "completed",
  },
];

/**
 * جلسات محادثة سابقة تجريبية (Mock Chat Sessions)
 */
export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "تحليل مؤشرات العمليات والأداء",
    updatedAt: "اليوم • 10:30 ص",
    messageCount: 2,
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "اعرض لي عينة جدول يوضح مؤشرات أداء مصادر البيانات المركزية مع الرؤى الأساسية",
        timestamp: "10:29 ص",
        scope: "databases",
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content:
          "أهلاً بك! بناءً على استعلام مصادر البيانات المركزية المعرفة، يوضح الجدول التالي أبرز مؤشرات الكفاءة التشغيلية، ومعدلات الاستجابة، وحجم الاستفسارات المنفذة خلال الدورة الحالية:",
        timestamp: "10:30 ص",
        scope: "databases",
        isMockSample: true,
        reasoningSteps: STANDARD_REASONING_STEPS,
        insights: [
          {
            title: "معدل سرعة الاستجابة",
            value: "1.2 ثانية",
            description: "تحسن بنسبة 18% مقارنة بمتوسط الشهر الماضي",
            type: "positive",
          },
          {
            title: "نسبة استقرار الاتصال",
            value: "99.8%",
            description: "كافة قواعد البيانات تعمل بحالة مستقرة بدون انقطاع",
            type: "positive",
          },
          {
            title: "إجمالي الاستعلامات",
            value: "14,850",
            description: "استعلامات متزامنة تمت معالجتها بسلاسة",
            type: "info",
          },
        ],
        table: {
          caption: "جدول مؤشرات أداء مصادر البيانات المركزية (بيانات محاكاة)",
          headers: ["المصدر / النظام", "نوع الاتصال", "زمن الاستجابة", "حجم السجلات", "الحالة التشغيلية"],
          rows: [
            ["قاعدة بيانات PostgreSQL الأساسية", "Server Native", "45 مللي ثانية", "1.4M سجل", "متصل • مستقر"],
            ["مستودع السجلات MySQL", "Direct Connector", "85 مللي ثانية", "680K سجل", "متصل • مستقر"],
            ["واجهة REST API المركزية", "Bearer Auth", "140 مللي ثانية", "125K عملية", "نشط • تدفق حي"],
          ],
        },
        sources: [
          {
            id: "src-1",
            documentName: "مخطط_قواعد_البيانات_المؤسسية_2026.pdf",
            pageNumber: 12,
            snippet: "تعتمد المنصة آليات الاستعلام الموزع لتخفيف الحمل التشغيلي ومراقبة زمن الاستجابة في الوقت الفعلي...",
            confidence: "98.5%",
          },
        ],
      },
    ],
  },
  {
    id: "session-2",
    title: "حوكمة المستندات وسياسات المعرفة",
    updatedAt: "أمس • 04:15 م",
    messageCount: 2,
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "ما هي أهم بنود دليل الحوكمة وسياسة استبقاء البيانات مع ذكر مراجع الصفحات؟",
        timestamp: "04:14 م",
        scope: "documents",
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content:
          "استناداً إلى وثائق الحوكمة المرفوعة في قاعدة المعرفة، تتضمن السياسة المعتمدة ثلاثة محاور رئيسية:\n\n1. تصنيف البيانات وفق مستويات حساسية مشددة (عام، داخلي، سري للغاية).\n2. دورة استبقاء دورية للأرشفة الذاتية كل 180 يوماً مع تشفير كامل أثناء النقل والتخزين.\n3. تدقيق سجلات الاستعلام وتوليد تقارير الامتثال الشهرية تلقائياً.",
        timestamp: "04:15 م",
        scope: "documents",
        isMockSample: true,
        reasoningSteps: STANDARD_REASONING_STEPS,
        insights: [
          {
            title: "مستوى الامتثال",
            value: "100%",
            description: "مطابق لمعايير الحوكمة الوطنية وسياسات الأمن السيبراني",
            type: "positive",
          },
          {
            title: "فترة الاستبقاء",
            value: "180 يوماً",
            description: "تطبيق قواعد الأرشفة التلقائية بعد انقضاء المدة",
            type: "neutral",
          },
        ],
        sources: [
          {
            id: "src-2-1",
            documentName: "دليل_حوكمة_البيانات_والامتثال.pdf",
            pageNumber: 7,
            snippet: "البند 4.2: تخضع كافة الوثائق والتقارير المالية لفهارس استرجاع معزولة تضمن عدم تسريب السياق...",
            confidence: "99.1%",
          },
          {
            id: "src-2-2",
            documentName: "سياسة_استبقاء_السجلات_الرقمية.docx",
            pageNumber: 19,
            snippet: "تُصنف السجلات إلى فئات نشطة ومؤرشفة، وتُحذف المستندات المؤقتة تلقائياً بعد اكتمال الفهرسة...",
            confidence: "95.4%",
          },
        ],
      },
    ],
  },
];

/**
 * توليد رد تجريبي متقدم على أي استفسار جديد يرسله المستخدم
 */
export function generateMockAssistantReply(
  userQuestion: string,
  scope: ChatScope = "all"
): ChatMessage {
  const isTableRequested =
    userQuestion.includes("جدول") ||
    userQuestion.includes("table") ||
    userQuestion.includes("أرقام") ||
    userQuestion.includes("مؤشرات") ||
    userQuestion.includes("مقارنة") ||
    userQuestion.includes("نمو");

  const isSourcesRequested =
    scope === "documents" ||
    userQuestion.includes("مراجع") ||
    userQuestion.includes("مستند") ||
    userQuestion.includes("ملف") ||
    userQuestion.includes("مصدر") ||
    userQuestion.includes("دليل");

  const isPartialRequested =
    userQuestion.includes("جزئي") ||
    userQuestion.includes("partial") ||
    userQuestion.includes("رسم بياني غير متاح");

  const now = new Date();
  const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: `بناءً على تحليلي لاستفسارك: «${userQuestion}» ضمن نطاق (${
      scope === "databases"
        ? "قواعد البيانات المركزية"
        : scope === "documents"
        ? "قاعدة المعرفة والمستندات"
        : "كافة المصادر والمستندات"
    })، تم استخراج وتنسيق النتائج الآتية لتقديم رؤية تحليلية شاملة:`,
    timestamp: timeString,
    scope,
    isMockSample: true,
    reasoningSteps: STANDARD_REASONING_STEPS,
    insights: [
      {
        title: "درجة مطابقة الاستعلام",
        value: "98.6%",
        description: "تم استخراج السياق بدقة عالية عبر الفهارس المعتمدة",
        type: "positive",
      },
      {
        title: "مصادر البيانات المفحوصة",
        value: scope === "databases" ? "4 قواعد بيانات" : scope === "documents" ? "12 مستنداً" : "16 مصدراً شاملاً",
        description: "تكامل حي مع جداول الـ SQL والمستندات المفهرسة",
        type: "info",
      },
      {
        title: "توصية التحليل",
        value: "معتمد وموثوق",
        description: "البيانات مؤكدة ومناسبة لاتخاذ القرارات التشغيلية",
        type: "neutral",
      },
    ],
  };

  if (isTableRequested || scope === "databases") {
    message.table = {
      caption: "جدول المؤشرات والنتائج المستخرجة (عينة تحليلية)",
      headers: ["المعيار / البند", "النتيجة الحالية", "المستهدف الفصلي", "نسبة الإنجاز", "الحالة"],
      rows: [
        ["استفسارات النماذج الذكية", "24,850 استعلام", "20,000 استعلام", "124%", "فائق الأداء"],
        ["متوسط وقت معالجة RAG", "0.95 ثانية", "1.50 ثانية", "136%", "ممتاز"],
        ["سعة المعرفة المفهرسة", "1.2 جيجابايت", "1.0 جيجابايت", "120%", "مكتمل"],
        ["دقة استخراج الإجابات", "98.2%", "95.0%", "103%", "مستقر"],
      ],
    };
  }

  if (isSourcesRequested || scope === "all") {
    message.sources = [
      {
        id: `src-${Date.now()}-1`,
        documentName: "تقرير_الأداء_المؤسسي_Q3_2026.pdf",
        pageNumber: 14,
        snippet: "يوضح التقرير التوسع المستمر في معالجة طلبات الأعمال ودمج النماذج الذكية لتعزيز الكفاءة...",
        confidence: "98.8%",
      },
      {
        id: `src-${Date.now()}-2`,
        documentName: "مستودع_قواعد_البيانات_التشغيلية.xlsx",
        pageNumber: 2,
        snippet: "جدول المعايير والمؤشرات المحدثة يومياً والتي تتبع معايير النزاهة والحوكمة الرقمية...",
        confidence: "96.2%",
      },
    ];
  }

  // دعم محاكاة النتيجة الجزئية (Partial Result) إذا طُلب صراحة أو كمثال
  if (isPartialRequested) {
    message.partialError = "تنبيه معالجة جزئية: تعذر رسم المخطط البياني التفاعلي لعدم كفاية نقاط التباعد الزمني، وتم عرض الملخص التحليلي والبيانات الجدولية بنجاح.";
  }

  return message;
}
