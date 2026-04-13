import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";
import { SectionNode } from "./SectionNode";

// ── SchematicCanvas ──────────────────────────────────────────────────────────

export function SchematicCanvas() {
  const layout = useDocTypeBuilderStore((s) => s.layout);
  const addTab = useDocTypeBuilderStore((s) => s.addTab);
  const addSection = useDocTypeBuilderStore((s) => s.addSection);
  const addColumn = useDocTypeBuilderStore((s) => s.addColumn);
  const removeSection = useDocTypeBuilderStore((s) => s.removeSection);
  const updateSection = useDocTypeBuilderStore((s) => s.updateSection);

  const [activeTab, setActiveTab] = useState("0");

  // Ensure activeTab is within bounds when tabs are removed
  const activeTabIdx = Math.min(
    Number(activeTab),
    layout.tabs.length - 1,
  );
  const resolvedTab = String(Math.max(0, activeTabIdx));

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={resolvedTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-1">
          <TabsList>
            {layout.tabs.map((tab, idx) => (
              <TabsTrigger key={idx} value={String(idx)}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => addTab()}
            className="text-muted-foreground"
          >
            <Plus className="h-3 w-3" />
            Tab
          </Button>
        </div>

        {layout.tabs.map((tab, tabIdx) => (
          <TabsContent key={tabIdx} value={String(tabIdx)}>
            <div className="mt-2">
              {tab.sections.map((section, sectionIdx) => (
                <SectionNode
                  key={sectionIdx}
                  section={section}
                  tabIdx={tabIdx}
                  sectionIdx={sectionIdx}
                  onAddColumn={() => addColumn(tabIdx, sectionIdx)}
                  onRemoveSection={() => removeSection(tabIdx, sectionIdx)}
                  onUpdateLabel={(label) =>
                    updateSection(tabIdx, sectionIdx, { label })
                  }
                />
              ))}

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection(tabIdx)}
                  className="text-muted-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Section
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
