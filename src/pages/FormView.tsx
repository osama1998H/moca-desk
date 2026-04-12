import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMetaType } from "@/providers/MetaProvider";
import {
  useDocument,
  useDocCreate,
  useDocUpdate,
} from "@/providers/DocProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useDirtyTracking } from "@/hooks/useDirtyTracking";
import { useRealtimeDoc } from "@/hooks/useRealtimeDoc";
import { parseLayout, type ParsedSection } from "@/utils/layoutParser";
import {
  evaluateDependsOn,
  evaluateMandatoryDependsOn,
} from "@/utils/expressionEval";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { StaleDocBanner } from "@/components/realtime/StaleDocBanner";
import { VersionHistory } from "@/components/version/VersionHistory";
import { WorkflowBar } from "@/components/workflow/WorkflowBar";
import { WorkflowTimeline } from "@/components/workflow/WorkflowTimeline";
import { LAYOUT_TYPES } from "@/components/fields/types";
import { MocaApiError } from "@/api/client";
import type { DocRecord, FieldDef } from "@/api/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SaveIcon, XIcon, Loader2Icon, HistoryIcon } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build a synthetic FieldDef for SectionBreak from a parsed section. */
function sectionToFieldDef(section: ParsedSection): FieldDef {
  return {
    name: `_section_${section.label}`,
    field_type: "SectionBreak",
    label: section.label,
    layout_label: section.label,
    required: false,
    read_only: false,
    in_api: false,
    collapsible: section.collapsible,
    collapsed_by_default: section.collapsedByDefault,
  };
}

/** Collect default values from meta fields for a new document. */
function getDefaults(fields: FieldDef[]): DocRecord {
  const defaults: DocRecord = {};
  for (const f of fields) {
    if (LAYOUT_TYPES.has(f.field_type)) continue;
    if (f.default !== undefined && f.default !== null && f.default !== "") {
      defaults[f.name] = f.default;
    }
  }
  return defaults;
}

// ── Component ──────────────────────────────────────────────────────────────

export function FormView() {
  const { doctype = "", name } = useParams<{ doctype: string; name: string }>();
  const navigate = useNavigate();
  const isNew = !name || name === "new";

  const { data: meta, isLoading: metaLoading, error: metaError } = useMetaType(doctype);
  const {
    data: serverDoc,
    isLoading: docLoading,
    error: docError,
  } = useDocument(doctype, isNew ? "" : (name ?? ""));

  const createMutation = useDocCreate(doctype);
  const updateMutation = useDocUpdate(doctype, isNew ? "" : (name ?? ""));
  const { canWrite, canCreate } = usePermissions(doctype);

  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState<DocRecord>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Initialize form values from server doc or defaults
  const initialSnapshot = useMemo<DocRecord | undefined>(() => {
    if (isNew && meta) return getDefaults(meta.fields);
    if (serverDoc) return { ...serverDoc };
    return undefined;
  }, [isNew, meta, serverDoc]);

  useEffect(() => {
    if (initialSnapshot && !initialized) {
      setFormValues({ ...initialSnapshot });
      setInitialized(true);
    }
  }, [initialSnapshot, initialized]);

  // Reset when navigating to a different document
  useEffect(() => {
    setInitialized(false);
    setErrors({});
    setActiveTab(0);
  }, [doctype, name]);

  const { isDirty } = useDirtyTracking(formValues, initialSnapshot);

  // Real-time updates from other users
  const { lastEvent, isStale } = useRealtimeDoc(
    doctype,
    isNew ? "" : (name ?? ""),
  );

  // Auto-refresh when form is clean and a remote change arrives.
  useEffect(() => {
    if (!lastEvent || isDirty) return;
    void queryClient.invalidateQueries({ queryKey: ["doc", doctype, name] });
    setInitialized(false);
    toast(`Updated by ${lastEvent.user}`, { duration: 3000 });
  }, [lastEvent, isDirty, queryClient, doctype, name]);

  // Parse layout
  const layout = useMemo(
    () => (meta ? parseLayout(meta.fields) : { tabs: [] }),
    [meta],
  );

  // Field change handler
  const handleFieldChange = useCallback(
    (fieldName: string) => (value: unknown) => {
      setFormValues((prev) => ({ ...prev, [fieldName]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    },
    [],
  );

  // Save handler
  const handleSave = useCallback(async () => {
    try {
      setErrors({});
      if (isNew) {
        const created = await createMutation.mutateAsync(formValues);
        const newName = (created as DocRecord).name as string;
        if (newName) {
          navigate(`/desk/app/${doctype}/${encodeURIComponent(newName)}`, {
            replace: true,
          });
        }
      } else {
        const updated = await updateMutation.mutateAsync(formValues);
        setFormValues({ ...updated });
        setInitialized(true);
      }
    } catch (err) {
      if (err instanceof MocaApiError && err.details) {
        const fieldErrors: Record<string, string> = {};
        for (const d of err.details) {
          fieldErrors[d.field] = d.message;
        }
        setErrors(fieldErrors);
      }
    }
  }, [isNew, formValues, createMutation, updateMutation, navigate, doctype]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    if (isNew) {
      navigate(`/desk/app/${doctype}`);
    } else if (initialSnapshot) {
      setFormValues({ ...initialSnapshot });
      setErrors({});
    }
  }, [isNew, initialSnapshot, navigate, doctype]);

  // ── Loading / Error states ─────────────────────────────────────────────

  if (metaLoading || (!isNew && docLoading)) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (metaError || docError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {metaError?.message || docError?.message || "Failed to load"}
      </div>
    );
  }

  if (!meta) return null;

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const readOnly = isNew ? !canCreate : !canWrite;

  // Document title
  const docTitle = isNew
    ? `New ${meta.label || doctype}`
    : meta.title_field
      ? String(formValues[meta.title_field] || formValues.name || name)
      : String(formValues.name || name);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Title bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{docTitle}</h1>
          {isDirty && (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isNew && meta.track_changes && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(true)}
            >
              <HistoryIcon data-icon="inline-start" />
              History
            </Button>
          )}
          {!isNew && name && (
            <WorkflowTimeline doctype={doctype} name={name} />
          )}
          {!readOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <XIcon data-icon="inline-start" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => void handleSave()}
                disabled={isSaving || (!isNew && !isDirty)}
              >
                {isSaving ? (
                  <Loader2Icon data-icon="inline-start" className="animate-spin" />
                ) : (
                  <SaveIcon data-icon="inline-start" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Workflow bar */}
      {!isNew && name && (
        <div className="mb-4">
          <WorkflowBar doctype={doctype} name={name} />
        </div>
      )}

      {/* Stale document banner (dirty form + remote change) */}
      {isDirty && isStale && lastEvent && (
        <StaleDocBanner
          user={lastEvent.user}
          onReload={() => {
            void queryClient.invalidateQueries({
              queryKey: ["doc", doctype, name],
            });
            setInitialized(false);
          }}
        />
      )}

      {/* Tab bar */}
      {layout.tabs.length > 1 && (
        <div className="mb-4 flex gap-1 border-b border-border">
          {layout.tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                i === activeTab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Form body — active tab's sections */}
      {layout.tabs[activeTab]?.sections.map((section, si) => (
        <SectionBreak
          key={`${section.label}-${si}`}
          fieldDef={sectionToFieldDef(section)}
        >
          <div
            className="grid gap-x-6 gap-y-4"
            style={{
              gridTemplateColumns: `repeat(${section.columns.length}, minmax(0, 1fr))`,
            }}
          >
            {section.columns.map((col, ci) => (
              <div key={ci} className="space-y-4">
                {col.fields
                  .filter((f) => {
                    if (f.hidden) return false;
                    if (LAYOUT_TYPES.has(f.field_type)) return false;
                    return evaluateDependsOn(f.depends_on, formValues);
                  })
                  .map((field) => {
                    const isRequired =
                      field.required ||
                      evaluateMandatoryDependsOn(
                        field.mandatory_depends_on,
                        formValues,
                      );
                    const fieldReadOnly =
                      readOnly || field.read_only || false;

                    return (
                      <FieldRenderer
                        key={field.name}
                        fieldDef={{
                          ...field,
                          required: isRequired,
                        }}
                        value={formValues[field.name]}
                        onChange={handleFieldChange(field.name)}
                        readOnly={fieldReadOnly}
                        error={errors[field.name]}
                        doc={formValues}
                      />
                    );
                  })}
              </div>
            ))}
          </div>
        </SectionBreak>
      ))}
      {/* Version history sidebar */}
      {!isNew && meta.track_changes && (
        <VersionHistory
          doctype={doctype}
          name={name!}
          fields={meta.fields}
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
}

export default FormView;
