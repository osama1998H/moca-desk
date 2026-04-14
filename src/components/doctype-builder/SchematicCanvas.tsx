import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const updateTab = useDocTypeBuilderStore((s) => s.updateTab);
  const removeTab = useDocTypeBuilderStore((s) => s.removeTab);
  const addSection = useDocTypeBuilderStore((s) => s.addSection);
  const addColumn = useDocTypeBuilderStore((s) => s.addColumn);
  const removeSection = useDocTypeBuilderStore((s) => s.removeSection);
  const updateSection = useDocTypeBuilderStore((s) => s.updateSection);

  const [activeTab, setActiveTab] = useState("0");
  const [editingTab, setEditingTab] = useState<number | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the rename input when it appears
  useEffect(() => {
    if (editingTab !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTab]);

  // Ensure activeTab is within bounds when tabs are removed
  const activeTabIdx = Math.min(
    Number(activeTab),
    layout.tabs.length - 1,
  );
  const resolvedTab = String(Math.max(0, activeTabIdx));

  const commitRename = (idx: number, value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      updateTab(idx, { label: trimmed });
    }
    setEditingTab(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={resolvedTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-1">
          <TabsList>
            {layout.tabs.map((tab, idx) => (
              <div key={idx} className="group relative flex items-center">
                <TabsTrigger
                  value={String(idx)}
                  onDoubleClick={() => setEditingTab(idx)}
                >
                  {editingTab === idx ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      defaultValue={tab.label}
                      className="w-20 bg-transparent text-center text-sm outline-none"
                      onBlur={(e) => commitRename(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitRename(idx, e.currentTarget.value);
                        }
                        if (e.key === "Escape") {
                          setEditingTab(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    tab.label
                  )}
                </TabsTrigger>

                {/* Tab options dropdown — only show when not editing */}
                {editingTab !== idx && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-0.5 h-5 w-5 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Tab options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setEditingTab(idx)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Rename
                      </DropdownMenuItem>
                      {layout.tabs.length > 1 && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => removeTab(idx)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete tab
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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
