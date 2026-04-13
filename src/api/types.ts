// ── Field Types ─────────────────────────────────────────────────────────────
// Mirrors pkg/meta/fielddef.go FieldType constants (29 storage + 6 layout).

export type FieldType =
  // Storage types
  | "Data"
  | "Text"
  | "LongText"
  | "Markdown"
  | "Code"
  | "Int"
  | "Float"
  | "Currency"
  | "Percent"
  | "Date"
  | "Datetime"
  | "Time"
  | "Duration"
  | "Select"
  | "Link"
  | "DynamicLink"
  | "Table"
  | "TableMultiSelect"
  | "Attach"
  | "AttachImage"
  | "Check"
  | "Color"
  | "Geolocation"
  | "JSON"
  | "Password"
  | "Rating"
  | "Signature"
  | "Barcode"
  | "HTMLEditor"
  // Layout-only types
  | "SectionBreak"
  | "ColumnBreak"
  | "TabBreak"
  | "HTML"
  | "Button"
  | "Heading"
  // Custom field types: accepts any string while preserving autocomplete for built-ins.
  // The (string & {}) idiom prevents TypeScript from collapsing the union to plain string.
  | (string & {});

// ── Naming ──────────────────────────────────────────────────────────────────
// Mirrors pkg/meta/metatype.go NamingStrategy.

export interface NamingStrategy {
  rule: string;
  pattern?: string;
  field_name?: string;
  custom_func?: string;
}

// ── Field Definition ────────────────────────────────────────────────────────
// Mirrors apiFieldDef in pkg/api/rest.go:367-395.

export interface FieldDef {
  name: string;
  field_type: FieldType;
  label: string;
  required: boolean;
  read_only: boolean;
  in_api: boolean;
  api_read_only?: boolean;
  api_alias?: string;
  options?: string;
  depends_on?: string;
  mandatory_depends_on?: string;
  default?: unknown;
  max_length?: number;
  max_value?: number;
  min_value?: number;
  width?: string;
  in_list_view?: boolean;
  in_filter?: boolean;
  in_preview?: boolean;
  hidden?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  unique?: boolean;
  collapsible?: boolean;
  collapsed_by_default?: boolean;
  col_span?: number;
  layout_label?: string;
}

// ── Layout Types ─────────────────────────────────────────────────────────────
// Mirrors meta.LayoutTree, meta.TabDef, meta.SectionDef, meta.ColumnDef
// in pkg/meta/layout.go.

export interface LayoutTree {
  tabs: TabDef[];
}
export interface TabDef {
  label: string;
  sections: SectionDef[];
}
export interface SectionDef {
  label?: string;
  collapsible?: boolean;
  collapsed_by_default?: boolean;
  columns: ColumnDef[];
}
export interface ColumnDef {
  width?: number;
  fields: string[];
}

// ── MetaType ────────────────────────────────────────────────────────────────
// Mirrors apiMetaResponse in pkg/api/rest.go.

export interface MetaType {
  name: string;
  label?: string;
  description?: string;
  module?: string;
  naming_rule: NamingStrategy;
  title_field?: string;
  image_field?: string;
  sort_field?: string;
  sort_order?: string;
  search_fields?: string[];
  fields: FieldDef[];
  layout?: LayoutTree;
  fields_map?: Record<string, FieldDef>;
  is_single: boolean;
  is_submittable: boolean;
  is_child_table: boolean;
  track_changes?: boolean;
  allow_get: boolean;
  allow_create: boolean;
  allow_update: boolean;
  allow_delete: boolean;
  allow_list: boolean;
}

// ── Auth ────────────────────────────────────────────────────────────────────
// Mirrors pkg/auth/jwt.go TokenPair and AccessClaims.

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface User {
  email: string;
  full_name: string;
  site: string;
  roles: string[];
  user_defaults?: Record<string, string>;
}

// ── Response Envelopes ──────────────────────────────────────────────────────
// Mirrors pkg/api/response.go envelope types.

export interface ApiResponse<T> {
  data: T;
}

export interface ListMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: ListMeta;
}

export interface FieldError {
  field: string;
  message: string;
  rule: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: FieldError[];
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}

// ── Permissions ─────────────────────────────────────────────────────────────
// Mirrors pkg/auth/permission.go bitmask values.

export const Perm = {
  Read: 1,
  Write: 2,
  Create: 4,
  Delete: 8,
  Submit: 16,
  Cancel: 32,
  Amend: 64,
} as const;

export type PermValue = (typeof Perm)[keyof typeof Perm];

// ── Document ────────────────────────────────────────────────────────────────

export type DocRecord = Record<string, unknown>;

export interface ListOptions {
  limit?: number;
  offset?: number;
  order_by?: string;
  filters?: FilterTuple[];
  fields?: string[];
}

export type FilterOperator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "like"
  | "not like"
  | "in"
  | "not in"
  | "between"
  | "is null"
  | "is not null"
  | "json_contains";

export type FilterTuple = [string, FilterOperator, unknown];

export interface Permissions {
  canRead: boolean;
  canWrite: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canSubmit: boolean;
  canCancel: boolean;
}

// ── Report Types ──────────────────────────────────────────────────────────

export interface ReportColumn {
  field_name: string;
  label: string;
  field_type: FieldType;
  width?: number;
}

export interface ReportFilter {
  field_name: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  default?: unknown;
}

export interface ChartConfig {
  type: string;
}

export interface ReportMeta {
  name: string;
  doc_type: string;
  type: string;
  columns: ReportColumn[];
  filters: ReportFilter[];
  chart_config?: ChartConfig;
}

export interface ReportExecuteRequest {
  filters: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

// ── Dashboard Types ───────────────────────────────────────────────────────

export type DashWidgetType = "number_card" | "chart" | "list" | "shortcut";

export interface DashWidget {
  type: DashWidgetType;
  config: Record<string, unknown>;
}

export interface DashDef {
  name: string;
  label: string;
  widgets: DashWidget[];
}

// ── Workflow Types ──────────────────────────────────────────

export interface WorkflowBranchStatus {
  branch: string;
  state: string;
  style: string;
  is_active: boolean;
  entered_at: string;
  sla_deadline?: string;
}

export interface WorkflowStatus {
  workflow_name: string;
  is_parallel: boolean;
  branches: WorkflowBranchStatus[];
}

export interface WorkflowAvailableAction {
  action: string;
  to_state: string;
  branch_name: string;
  require_comment: boolean;
  style: string;
}

export interface WorkflowStateResponse {
  status: WorkflowStatus;
  actions: WorkflowAvailableAction[];
}

export interface WorkflowActionRecord {
  id: string;
  action: string;
  from_state: string;
  to_state: string;
  branch_name: string;
  user: string;
  comment: string;
  timestamp: string;
}

export interface WorkflowTransitionRequest {
  action: string;
  comment?: string;
  branch?: string;
}

export interface WorkflowTransitionResponse {
  status: string;
  state: WorkflowStatus;
}
