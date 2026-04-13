import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { PropertyDef, PropertySchema } from "./types";

export interface PropertyPanelProps {
  schema: PropertySchema;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  title?: string;
}

function PropertyField({
  prop,
  value,
  onChange,
}: {
  prop: PropertyDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (prop.type) {
    case "text":
    case "code":
    case "link":
      return (
        <Input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={prop.placeholder}
        />
      );

    case "textarea":
      return (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={prop.placeholder}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={prop.placeholder}
        />
      );

    case "boolean":
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked)}
        />
      );

    case "select":
      return (
        <Select
          value={(value as string) ?? ""}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={prop.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {prop.options?.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return null;
  }
}

export function PropertyPanel({
  schema,
  values,
  onChange,
  title,
}: PropertyPanelProps) {
  return (
    <div className="flex flex-col">
      {title && (
        <div className="border-b px-3 py-2 text-sm font-medium">{title}</div>
      )}

      {schema.sections.map((section) => (
        <Collapsible
          key={section.label}
          defaultOpen={!section.collapsed}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/50">
            {section.label}
            <ChevronDown className="size-3.5 transition-transform [[data-state=open]>&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-3 px-3 py-3">
              {section.properties.map((prop) => {
                if (prop.dependsOn && !prop.dependsOn(values)) {
                  return null;
                }

                return (
                  <div key={prop.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">{prop.label}</Label>
                      {prop.type === "boolean" && (
                        <PropertyField
                          prop={prop}
                          value={values[prop.key]}
                          onChange={(v) => onChange(prop.key, v)}
                        />
                      )}
                    </div>
                    {prop.description && (
                      <p className="text-xs text-muted-foreground">
                        {prop.description}
                      </p>
                    )}
                    {prop.type !== "boolean" && (
                      <PropertyField
                        prop={prop}
                        value={values[prop.key]}
                        onChange={(v) => onChange(prop.key, v)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
