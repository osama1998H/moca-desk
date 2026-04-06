import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMetaType } from "@/providers/MetaProvider";
import { useDocument, useDocCreate, useDocUpdate, } from "@/providers/DocProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useDirtyTracking } from "@/hooks/useDirtyTracking";
import { useRealtimeDoc } from "@/hooks/useRealtimeDoc";
import { parseLayout } from "@/utils/layoutParser";
import { evaluateDependsOn, evaluateMandatoryDependsOn, } from "@/utils/expressionEval";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { StaleDocBanner } from "@/components/realtime/StaleDocBanner";
import { VersionHistory } from "@/components/version/VersionHistory";
import { LAYOUT_TYPES } from "@/components/fields/types";
import { MocaApiError } from "@/api/client";
import { cn } from "@/lib/utils";
import { SaveIcon, XIcon, Loader2Icon, HistoryIcon } from "lucide-react";
// ── Helpers ────────────────────────────────────────────────────────────────
/** Build a synthetic FieldDef for SectionBreak from a parsed section. */
function sectionToFieldDef(section) {
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
function getDefaults(fields) {
    const defaults = {};
    for (const f of fields) {
        if (LAYOUT_TYPES.has(f.field_type))
            continue;
        if (f.default !== undefined && f.default !== null && f.default !== "") {
            defaults[f.name] = f.default;
        }
    }
    return defaults;
}
// ── Component ──────────────────────────────────────────────────────────────
export function FormView() {
    const { doctype = "", name } = useParams();
    const navigate = useNavigate();
    const isNew = !name || name === "new";
    const { data: meta, isLoading: metaLoading, error: metaError } = useMetaType(doctype);
    const { data: serverDoc, isLoading: docLoading, error: docError, } = useDocument(doctype, isNew ? "" : (name ?? ""));
    const createMutation = useDocCreate(doctype);
    const updateMutation = useDocUpdate(doctype, isNew ? "" : (name ?? ""));
    const { canWrite, canCreate } = usePermissions(doctype);
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [initialized, setInitialized] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    // Initialize form values from server doc or defaults
    const initialSnapshot = useMemo(() => {
        if (isNew && meta)
            return getDefaults(meta.fields);
        if (serverDoc)
            return { ...serverDoc };
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
    const { lastEvent, isStale } = useRealtimeDoc(doctype, isNew ? "" : (name ?? ""));
    // Auto-refresh when form is clean and a remote change arrives.
    useEffect(() => {
        if (!lastEvent || isDirty)
            return;
        void queryClient.invalidateQueries({ queryKey: ["doc", doctype, name] });
        setInitialized(false);
        toast(`Updated by ${lastEvent.user}`, { duration: 3000 });
    }, [lastEvent, isDirty, queryClient, doctype, name]);
    // Parse layout
    const layout = useMemo(() => (meta ? parseLayout(meta.fields) : { tabs: [] }), [meta]);
    // Field change handler
    const handleFieldChange = useCallback((fieldName) => (value) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
        // Clear field error on change
        setErrors((prev) => {
            if (!prev[fieldName])
                return prev;
            const next = { ...prev };
            delete next[fieldName];
            return next;
        });
    }, []);
    // Save handler
    const handleSave = useCallback(async () => {
        try {
            setErrors({});
            if (isNew) {
                const created = await createMutation.mutateAsync(formValues);
                const newName = created.name;
                if (newName) {
                    navigate(`/desk/app/${doctype}/${encodeURIComponent(newName)}`, {
                        replace: true,
                    });
                }
            }
            else {
                const updated = await updateMutation.mutateAsync(formValues);
                setFormValues({ ...updated });
                setInitialized(true);
            }
        }
        catch (err) {
            if (err instanceof MocaApiError && err.details) {
                const fieldErrors = {};
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
        }
        else if (initialSnapshot) {
            setFormValues({ ...initialSnapshot });
            setErrors({});
        }
    }, [isNew, initialSnapshot, navigate, doctype]);
    // ── Loading / Error states ─────────────────────────────────────────────
    if (metaLoading || (!isNew && docLoading)) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), "Loading..."] }));
    }
    if (metaError || docError) {
        return (_jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700", children: metaError?.message || docError?.message || "Failed to load" }));
    }
    if (!meta)
        return null;
    const isSaving = createMutation.isPending || updateMutation.isPending;
    const readOnly = isNew ? !canCreate : !canWrite;
    // Document title
    const docTitle = isNew
        ? `New ${meta.label || doctype}`
        : meta.title_field
            ? String(formValues[meta.title_field] || formValues.name || name)
            : String(formValues.name || name);
    return (_jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: docTitle }), isDirty && (_jsx("span", { className: "text-xs text-amber-600", children: "Unsaved changes" }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [!isNew && meta.track_changes && (_jsxs("button", { type: "button", onClick: () => setHistoryOpen(true), className: "inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(HistoryIcon, { className: "size-3.5" }), "History"] })), !readOnly && (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", onClick: handleCancel, disabled: isSaving, className: "inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: [_jsx(XIcon, { className: "size-3.5" }), "Cancel"] }), _jsxs("button", { type: "button", onClick: () => void handleSave(), disabled: isSaving || (!isNew && !isDirty), className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50", children: [isSaving ? (_jsx(Loader2Icon, { className: "size-3.5 animate-spin" })) : (_jsx(SaveIcon, { className: "size-3.5" })), "Save"] })] }))] })] }), isDirty && isStale && lastEvent && (_jsx(StaleDocBanner, { user: lastEvent.user, onReload: () => {
                    void queryClient.invalidateQueries({
                        queryKey: ["doc", doctype, name],
                    });
                    setInitialized(false);
                } })), layout.tabs.length > 1 && (_jsx("div", { className: "mb-4 flex gap-1 border-b border-gray-200", children: layout.tabs.map((tab, i) => (_jsx("button", { type: "button", onClick: () => setActiveTab(i), className: cn("px-4 py-2 text-sm font-medium transition-colors", i === activeTab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"), children: tab.label }, tab.label))) })), layout.tabs[activeTab]?.sections.map((section, si) => (_jsx(SectionBreak, { fieldDef: sectionToFieldDef(section), children: _jsx("div", { className: "grid gap-x-6 gap-y-4", style: {
                        gridTemplateColumns: `repeat(${section.columns.length}, minmax(0, 1fr))`,
                    }, children: section.columns.map((col, ci) => (_jsx("div", { className: "space-y-4", children: col.fields
                            .filter((f) => {
                            if (f.hidden)
                                return false;
                            if (LAYOUT_TYPES.has(f.field_type))
                                return false;
                            return evaluateDependsOn(f.depends_on, formValues);
                        })
                            .map((field) => {
                            const isRequired = field.required ||
                                evaluateMandatoryDependsOn(field.mandatory_depends_on, formValues);
                            const fieldReadOnly = readOnly || field.read_only || false;
                            return (_jsx(FieldRenderer, { fieldDef: {
                                    ...field,
                                    required: isRequired,
                                }, value: formValues[field.name], onChange: handleFieldChange(field.name), readOnly: fieldReadOnly, error: errors[field.name], doc: formValues }, field.name));
                        }) }, ci))) }) }, `${section.label}-${si}`))), !isNew && meta.track_changes && (_jsx(VersionHistory, { doctype: doctype, name: name, fields: meta.fields, open: historyOpen, onClose: () => setHistoryOpen(false) }))] }));
}
export default FormView;
