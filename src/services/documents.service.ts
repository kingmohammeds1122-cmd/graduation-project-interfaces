/**
 * خدمة المستندات وقاعدة المعرفة (Documents Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import { DocumentItem, DocumentFilterOptions, DocumentFileType } from "@/types/documents.types";
import { mockDocuments } from "@/mocks/documents.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

let localDocuments: DocumentItem[] = [...mockDocuments];

export async function getDocuments(
  filters?: Partial<DocumentFilterOptions>,
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<DocumentItem[]> {
  const { delayMs = 300, forceError = false } = options;

  if (USE_MOCK_API) {
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

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<DocumentItem[]>(API_ENDPOINTS.DOCUMENTS.LIST, {
    method: "GET",
    params: {
      search: filters?.searchQuery,
      status: filters?.statusFilter !== "all" ? filters?.statusFilter : undefined,
      type: filters?.typeFilter !== "all" ? filters?.typeFilter : undefined,
    },
  });
}

export async function addMockDocument(fileData: {
  name: string;
  size: string;
  type: DocumentFileType;
}): Promise<DocumentItem> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      uploadedAt: `اليوم • ${timeString} (محاكاة)`,
      status: "processing",
      description: "مستند تم اختياره محلياً للمعاينة التجريبية (لم يُرفع لأي خادم).",
      isMock: true,
    };

    localDocuments = [newDoc, ...localDocuments];
    return newDoc;
  }

  // في الوضع الفعلي يتم إرسال بيانات الملف للـ Backend
  return await apiRequest<DocumentItem>(API_ENDPOINTS.DOCUMENTS.UPLOAD, {
    method: "POST",
    body: JSON.stringify(fileData),
  });
}

export const uploadDocument = addMockDocument;

export async function retryProcessingMock(documentId: string): Promise<DocumentItem> {
  if (USE_MOCK_API) {
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

  return await apiRequest<DocumentItem>(API_ENDPOINTS.DOCUMENTS.RETRY(documentId), {
    method: "POST",
  });
}

export const retryDocumentProcessing = retryProcessingMock;

export async function deleteMockDocument(documentId: string): Promise<boolean> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localDocuments = localDocuments.filter((d) => d.id !== documentId);
    return true;
  }

  await apiRequest(API_ENDPOINTS.DOCUMENTS.DETAIL(documentId), {
    method: "DELETE",
  });
  return true;
}

export const deleteDocument = deleteMockDocument;
