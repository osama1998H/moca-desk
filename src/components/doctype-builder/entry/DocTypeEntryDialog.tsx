import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { CreateDocTypeForm } from "./CreateDocTypeForm";
import { DocTypeList } from "./DocTypeList";
import { EntryLanding } from "./EntryLanding";
import type { StageNewPayload } from "@/stores/doctype-builder-store";

type View = "landing" | "create" | "open";

interface DocTypeEntryDialogProps {
  open: boolean;
  onStage: (payload: StageNewPayload) => void;
  onOpenExisting: (name: string) => void;
}

export function DocTypeEntryDialog({
  open,
  onStage,
  onOpenExisting,
}: DocTypeEntryDialogProps) {
  const [view, setView] = useState<View>("landing");

  // Swallow both Escape and overlay-click so the dialog is non-dismissible.
  // The only way out is to pick an action or navigate via the sidebar.
  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 isolate z-50 bg-black/10 duration-100",
            "supports-backdrop-filter:backdrop-blur-xs",
            "data-open:animate-in data-open:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "fixed top-1/2 start-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            DocType Builder
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Create a new DocType or edit an existing one.
          </DialogPrimitive.Description>

          {view === "landing" && (
            <EntryLanding
              onCreate={() => setView("create")}
              onOpen={() => setView("open")}
            />
          )}
          {view === "create" && (
            <CreateDocTypeForm
              onStage={onStage}
              onBack={() => setView("landing")}
            />
          )}
          {view === "open" && (
            <DocTypeList
              onOpen={onOpenExisting}
              onBack={() => setView("landing")}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
