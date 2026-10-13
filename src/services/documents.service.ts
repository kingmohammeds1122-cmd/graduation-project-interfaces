import { DocumentItem, DocumentFilterOptions, DocumentFileType } from "@/types/documents.types";
import { mockDocuments } from "@/mocks/documents.mock";

/**
 * خدمة المستندات (Documents Service)
 * معزولة تماماً وتُدار محلياً عبر الوعود (Promises) من ملف الـ Mock،
 * مهيأة مستقبلاً للربط مع نقاط نهاية FastAPI لرفع الملفات دون المساس بواجهات العرض.
 */

let localDocuments: DocumentItem[] = [...mockDocuments];

export async function getDocuments(
  filters?: Partial<DocumentFilterOptions>,
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<DocumentItem[]> {
  const { delayMs = 300, forceError = false } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (forceError) {
    throw new Error("تعذر جلب قائمة المستندات التجريبية، يرجى المحاولة مرة أخرى.");
  }

  let filtered = [...localDocuments];

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }

  if (filters?.statusFilter && filters.statusFilter !== "all") {
    filtered = filtered.filter((d) => d.status === filters.statusFilter);
  }

  if (filters?.typeFilter && filters.typeFilter !== "all") {
    filtered = filtered.filter((d) => d.type === filters.typeFilter);
  }

  return filtered;
}

export async function addMockDocument(fileData: {
  name: string;
  size: string;
  type: DocumentFileType;
}): Promise<DocumentItem> {
  // محاكاة تأخير إضافة الملف محلياً
  await new Promise((resolve) => setTimeout(resolve, 400));

  const now = new Date();
  const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const newDoc: DocumentItem = {
    id: `doc-${Date.now()}`,
    name: fileData.name,
    type: fileData.type,
    size: fileData.size,
    uploadedAt: `اليوم • ${timeString} (محاكاة)`,
    status: "processing", // يبدأ قيد المعالجة التجريبية
    description: "مستند تم اختياره محلياً للمعاينة التجريبية (لم يُرفع لأي خادم).",
    isMock: true,
  };

  localDocuments = [newDoc, ...localDocuments];
  return newDoc;
}

export async function retryProcessingMock(documentId: string): Promise<DocumentItem> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = localDocuments.findIndex((d) => d.id === documentId);
  if (index === -1) {
    throw new Error("المستند غير موجود.");
  }

  const updated: DocumentItem = {
    ...localDocuments[index],
    status: "completed",
    description: "تمت إعادة المحاكاة الافتراضية للمعالجة بنجاح.",
  };

  localDocuments = [
    ...localDocuments.slice(0, index),
    updated,
    ...localDocuments.slice(index + 1),
  ];

  return updated;
}

export async function deleteMockDocument(documentId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localDocuments = localDocuments.filter((d) => d.id !== documentId);
  return true;
}
