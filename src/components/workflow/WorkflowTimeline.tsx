import { formatDistanceToNow } from "date-fns";
import { HistoryIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { useWorkflowHistory } from "./useWorkflow";

interface WorkflowTimelineProps {
  doctype: string;
  name: string;
}

function initials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkflowTimeline({ doctype, name }: WorkflowTimelineProps) {
  const { data, isLoading } = useWorkflowHistory(doctype, name);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <HistoryIcon data-icon="inline-start" />
          Timeline
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Workflow Timeline</SheetTitle>
        <ScrollArea className="h-[calc(100vh-6rem)]">
          {isLoading && (
            <div className="flex flex-col gap-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {data && (
            <div className="flex flex-col gap-4 p-4">
              {data.map((entry, idx) => (
                <div key={entry.id}>
                  {idx > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials(entry.user)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{entry.user}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.action}</Badge>
                        {entry.branch_name && (
                          <Badge variant="secondary">{entry.branch_name}</Badge>
                        )}
                      </div>
                      {entry.comment && (
                        <p className="text-sm text-muted-foreground">
                          &ldquo;{entry.comment}&rdquo;
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <p className="text-sm text-muted-foreground">No workflow actions yet.</p>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
