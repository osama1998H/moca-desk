import { FileEdit, Plus } from "lucide-react";

interface EntryLandingProps {
  onCreate: () => void;
  onOpen: () => void;
}

export function EntryLanding({ onCreate, onOpen }: EntryLandingProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium">DocType Builder</h2>
        <p className="text-sm text-muted-foreground">
          Create a new DocType or edit an existing one.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCreate}
          className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition hover:border-primary hover:bg-accent"
        >
          <Plus className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Create New DocType</span>
          <span className="text-xs text-muted-foreground">
            Start from scratch
          </span>
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition hover:border-primary hover:bg-accent"
        >
          <FileEdit className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Edit Existing DocType</span>
          <span className="text-xs text-muted-foreground">
            Pick from your doctypes
          </span>
        </button>
      </div>
    </div>
  );
}
