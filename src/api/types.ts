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
  | "Heading";

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

// ── MetaType ────────────────────────────────────────────────────────────────
// Mirrors apiMetaResponse in pkg/api/rest.go:398-419.

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
