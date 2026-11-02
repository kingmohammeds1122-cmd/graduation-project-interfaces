/**
 * خدمة مصادر البيانات (Data Sources Service)
 * تدعم التبديل السلس بين وضع المحاكاة (Mock) والاتصال الفعلي بخادم FastAPI.
 */

import { DataSource, DataSourceFilterOptions } from "@/types/dataSources.types";
import { mockDataSources } from "@/mocks/dataSources.mock";
import { USE_MOCK_API, API_ENDPOINTS } from "@/lib/api-config";
import { apiRequest } from "@/lib/api-client";

// حالة محلية لذاكرة الجلسة في وضع المحاكاة
let localSources: DataSource[] = [...mockDataSources];

export async function getDataSources(
  filters?: Partial<DataSourceFilterOptions>,
  options: { delayMs?: number; forceError?: boolean } = {}
): Promise<DataSource[]> {
  const { delayMs = 300, forceError = false } = options;

  if (USE_MOCK_API) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (forceError) {
      throw new Error("تعذر جلب مصادر البيانات التجريبية، يرجى المحاولة مرة أخرى.");
    }

    let filtered = [...localSources];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (filters?.typeFilter && filters.typeFilter !== "all") {
      filtered = filtered.filter((s) => s.type === filters.typeFilter);
    }

    if (filters?.statusFilter && filters.statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === filters.statusFilter);
    }

    return filtered;
  }

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<DataSource[]>(API_ENDPOINTS.DATA_SOURCES.LIST, {
    method: "GET",
    params: {
      search: filters?.searchQuery,
      type: filters?.typeFilter !== "all" ? filters?.typeFilter : undefined,
      status: filters?.statusFilter !== "all" ? filters?.statusFilter : undefined,
    },
  });
}

export async function testConnectionMock(
  sourceId: string
): Promise<{ success: boolean; message: string; timestamp: string }> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const target = localSources.find((s) => s.id === sourceId);
    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (target && target.status === "error") {
      return {
        success: false,
        message: "تنبيه فحص تجريبي: تم اكتشاف محاكاة انقطاع الاتصال الافتراضي للمصدر.",
        timestamp: `اليوم • ${timeString} (محاكاة)`,
      };
    }

    return {
      success: true,
      message: "نجح فحص الاتصال التوضيحي (محاكاة)؛ لا يوجد اتصال فعلي بالخادم في هذه المرحلة.",
      timestamp: `اليوم • ${timeString} (محاكاة)`,
    };
  }

  // الاتصال الفعلي بـ FastAPI
  return await apiRequest<{ success: boolean; message: string; timestamp: string }>(
    API_ENDPOINTS.DATA_SOURCES.TEST_CONNECTION(sourceId),
    {
      method: "POST",
    }
  );
}

export const testDataSourceConnection = testConnectionMock;

export async function createMockDataSource(
  payload: Pick<DataSource, "name" | "type" | "description">
): Promise<DataSource> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newSource: DataSource = {
      id: `ds-${Date.now()}`,
      name: payload.name.trim(),
      type: payload.type,
      status: "connected",
      lastChecked: "الآن (عينة محاكاة)",
      recordCountEstimate: "عينة جديدة",
      description: payload.description?.trim() || "مصدر بيانات تجريبي مضاف حديثاً للمحاكاة.",
      isMock: true,
      schema: [
        {
          tableName: "sample_table_1 (جدول افتراضي)",
          rowCountEstimate: "100 سجل محاكى",
          columns: [
            { name: "id", type: "INT", isPrimary: true, description: "معرف افتراضي" },
            { name: "record_title", type: "VARCHAR", description: "اسم السجل التجريبي" },
          ],
        },
      ],
    };

    localSources = [newSource, ...localSources];
    return newSource;
  }

  return await apiRequest<DataSource>(API_ENDPOINTS.DATA_SOURCES.CREATE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const createDataSource = createMockDataSource;

export async function updateMockDataSource(
  id: string,
  payload: Pick<DataSource, "name" | "type" | "description">
): Promise<DataSource> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = localSources.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("المصدر المطلوب غير موجود.");
    }

    const updated: DataSource = {
      ...localSources[index],
      name: payload.name.trim(),
      type: payload.type,
      description: payload.description.trim(),
    };

    localSources = [
      ...localSources.slice(0, index),
      updated,
      ...localSources.slice(index + 1),
    ];

    return updated;
  }

  return await apiRequest<DataSource>(API_ENDPOINTS.DATA_SOURCES.DETAIL(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export const updateDataSource = updateMockDataSource;

export async function deleteMockDataSource(id: string): Promise<boolean> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localSources = localSources.filter((s) => s.id !== id);
    return true;
  }

  await apiRequest(API_ENDPOINTS.DATA_SOURCES.DETAIL(id), {
    method: "DELETE",
  });
  return true;
}

export const deleteDataSource = deleteMockDataSource;

export function resetMockDataSources(): void {
  localSources = [...mockDataSources];
}
