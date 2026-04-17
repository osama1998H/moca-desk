import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";

import { get, MocaApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse } from "@/api/types";
import type { StageNewPayload } from "@/stores/doctype-builder-store";
import { DEFAULT_SETTINGS } from "@/components/doctype-builder/types";

type TypeOption =
  | "Normal"
  | "Submittable"
  | "Single"
  | "Child Table"
  | "Virtual";

const TYPE_OPTIONS: { value: TypeOption; help: string }[] = [
  { value: "Normal", help: "A standard doctype with a table and list view." },
  { value: "Submittable", help: "Has a submit/cancel lifecycle." },
  { value: "Single", help: "Exactly one row, no list view (settings-like)." },
  { value: "Child Table", help: "Embedded inside parent doctypes via Table fields." },
  { value: "Virtual", help: "No database table — all logic is code." },
];

function validateName(name: string): string | null {
  if (!name) return null;
  if (!/^[A-Z]/.test(name)) return "Name must start with an uppercase letter";
  if (!/^[A-Za-z0-9]+$/.test(name))
    return "Name must contain only letters and digits (no spaces or underscores)";
  return null;
}

function flagsFor(type: TypeOption) {
  return {
    is_submittable: type === "Submittable",
    is_single: type === "Single",
    is_child_table: type === "Child Table",
    is_virtual: type === "Virtual",
  };
}

interface CreateDocTypeFormProps {
  onStage: (payload: StageNewPayload) => void;
  onBack: () => void;
}

export function CreateDocTypeForm({ onStage, onBack }: CreateDocTypeFormProps) {
  const [name, setName] = useState("");
  const [app, setApp] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [type, setType] = useState<TypeOption>("Normal");
  const [apps, setApps] = useState<{ name: string; modules: string[] }[]>([]);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    get<ApiResponse<{ name: string; modules: string[] }[]>>("dev/apps")
      .then((res) => setApps(res.data))
      .catch((e: unknown) => {
        setAppsError(e instanceof Error ? e.message : "Failed to load apps");
      });
  }, []);

  // Inline name availability check (debounced 300 ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const err = validateName(name);
    if (!name || err) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    let cancelled = false;
    debounceRef.current = setTimeout(() => {
      get(`dev/doctype/${name}`)
        .then(() => {
          if (!cancelled) setAvailability("taken");
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          if (e instanceof MocaApiError && e.status === 404) {
            setAvailability("available");
          } else {
            setAvailability("idle");
          }
        });
    }, 300);
    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [name]);

  const moduleOptions = useMemo(
    () => apps.find((a) => a.name === app)?.modules ?? [],
    [apps, app],
  );

  const nameError = validateName(name);
  const canSubmit =
    !!name &&
    !nameError &&
    availability !== "taken" &&
    !!app &&
    !!moduleName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onStage({
      name,
      app,
      module: moduleName,
      settings: {
        ...DEFAULT_SETTINGS,
        search_fields: [],
        ...flagsFor(type),
      },
    });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-medium">Create New DocType</h3>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="new-doctype-name">Name</Label>
        <div className="relative">
          <Input
            id="new-doctype-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer"
          />
          {availability === "available" && (
            <Check className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
          )}
          {availability === "taken" && (
            <XIcon className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
          )}
        </div>
        {nameError && (
          <span className="text-xs text-destructive">{nameError}</span>
        )}
        {availability === "taken" && (
          <span className="text-xs text-destructive">Name is taken</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="new-doctype-app">App</Label>
        <select
          id="new-doctype-app"
          value={app}
          onChange={(e) => {
            setApp(e.target.value);
            setModuleName("");
          }}
          className="h-9 rounded-md border bg-background px-2 text-sm"
        >
          <option value="">Select an app…</option>
          {apps.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        {appsError && (
          <span className="text-xs text-destructive">{appsError}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="new-doctype-module">Module</Label>
        <select
          id="new-doctype-module"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          disabled={!app}
          className="h-9 rounded-md border bg-background px-2 text-sm disabled:opacity-50"
        >
          <option value="">Select a module…</option>
          {moduleOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="new-doctype-type">Type</Label>
        <select
          id="new-doctype-type"
          value={type}
          onChange={(e) => setType(e.target.value as TypeOption)}
          className="h-9 rounded-md border bg-background px-2 text-sm"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {TYPE_OPTIONS.find((o) => o.value === type)?.help}
        </span>
      </div>

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={!canSubmit}>
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
