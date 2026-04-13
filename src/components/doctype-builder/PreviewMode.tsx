import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";

export function PreviewMode() {
  const layout = useDocTypeBuilderStore((s) => s.layout);
  const fields = useDocTypeBuilderStore((s) => s.fields);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs defaultValue="0">
        <TabsList>
          {layout.tabs.map((tab, i) => (
            <TabsTrigger key={i} value={String(i)}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {layout.tabs.map((tab, tabIdx) => (
          <TabsContent
            key={tabIdx}
            value={String(tabIdx)}
            className="space-y-6 mt-4"
          >
            {tab.sections.map((section, secIdx) => (
              <div key={secIdx} className="space-y-3">
                {section.label && (
                  <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">
                    {section.label}
                  </h3>
                )}
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: section.columns
                      .map((c) => `${c.width ?? 1}fr`)
                      .join(" "),
                  }}
                >
                  {section.columns.map((col, colIdx) => (
                    <div key={colIdx} className="space-y-3">
                      {col.fields.map((fieldName) => {
                        const fd = fields[fieldName];
                        if (!fd) return null;
                        return (
                          <FieldRenderer
                            key={fieldName}
                            fieldDef={fd}
                            value={fd.default ?? ""}
                            onChange={() => {}}
                            readOnly
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
