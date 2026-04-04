import { lazy } from "react";
// ── Layout type set ────────────────────────────────────────────────────────
export const LAYOUT_TYPES = new Set([
    "SectionBreak",
    "ColumnBreak",
    "TabBreak",
    "HTML",
    "Button",
    "Heading",
]);
export const FIELD_TYPE_MAP = {
    // Tier 1 — Storage
    Data: lazy(() => import("./DataField")),
    Text: lazy(() => import("./TextField")),
    LongText: lazy(() => import("./LongTextField")),
    Int: lazy(() => import("./IntField")),
    Float: lazy(() => import("./FloatField")),
    Currency: lazy(() => import("./CurrencyField")),
    Date: lazy(() => import("./DateField")),
    Datetime: lazy(() => import("./DatetimeField")),
    Select: lazy(() => import("./SelectField")),
    Link: lazy(() => import("./LinkField")),
    Check: lazy(() => import("./CheckField")),
    Attach: lazy(() => import("./AttachField")),
    Table: lazy(() => import("./TableField")),
    // Tier 1 — Layout
    SectionBreak: lazy(() => import("../layout/SectionBreak")),
    ColumnBreak: lazy(() => import("../layout/ColumnBreak")),
    TabBreak: lazy(() => import("../layout/TabBreak")),
    // Tier 2
    Markdown: lazy(() => import("./MarkdownField")),
    Code: lazy(() => import("./CodeField")),
    JSON: lazy(() => import("./JSONField")),
    Percent: lazy(() => import("./PercentField")),
    Time: lazy(() => import("./TimeField")),
    Duration: lazy(() => import("./DurationField")),
    Color: lazy(() => import("./ColorField")),
    Rating: lazy(() => import("./RatingField")),
    AttachImage: lazy(() => import("./AttachImageField")),
    Password: lazy(() => import("./PasswordField")),
    // Tier 3 — Layout stubs
    HTML: lazy(() => import("../layout/HTMLDisplay")),
    Button: lazy(() => import("../layout/ButtonField")),
    Heading: lazy(() => import("../layout/HeadingField")),
    // Tier 3 — Storage stubs
    DynamicLink: lazy(() => import("./StubField")),
    TableMultiSelect: lazy(() => import("./StubField")),
    Geolocation: lazy(() => import("./StubField")),
    Signature: lazy(() => import("./StubField")),
    Barcode: lazy(() => import("./StubField")),
    HTMLEditor: lazy(() => import("./StubField")),
};
