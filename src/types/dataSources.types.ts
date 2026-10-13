/**
 * تعريفات أنواع شاشة مصادر البيانات (Data Sources Types)
 */

export type DataSourceType =
  | "PostgreSQL"
  | "MySQL"
  | "REST API"
  | "CSV / Excel"
  | "MongoDB";

export type DataSourceStatus = "connected" | "disconnected" | "error" | "syncing";

export interface TableColumnSchema {
  name: string;
  type: string;
  isPrimary?: boolean;
  description?: string;
}

export interface TableSchema {
  tableName: string;
  rowCountEstimate: string;
  columns: TableColumnSchema[];
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastChecked: string;
  recordCountEstimate: string;
  description: string;
  schema: TableSchema[];
  isMock: boolean;
}

export interface DataSourceFilterOptions {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
}
