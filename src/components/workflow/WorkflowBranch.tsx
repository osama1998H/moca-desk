import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { WorkflowActionButton } from "./WorkflowActionButton";
import type {
  WorkflowAvailableAction,
  WorkflowBranchStatus,
} from "../../api/types";

interface WorkflowBranchProps {
  branch: WorkflowBranchStatus;
  actions: WorkflowAvailableAction[];
  onExecute: (action: string, comment: string, branch: string) => void;
  isLoading: boolean;
  doctype: string;
  name: string;
}

const STYLE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Success: "default",
  Warning: "secondary",
  Danger: "destructive",
  Info: "outline",
};

function slaProgress(deadline: string | undefined): { value: number; label: string } | null {
  if (!deadline) return null;
  const now = Date.now();
  const dl = new Date(deadline).getTime();
  const remaining = dl - now;
  if (remaining <= 0) return { value: 100, label: "SLA breached" };
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const label = hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
  const maxMs = 48 * 3600000;
  const elapsed = maxMs - remaining;
  const value = Math.min(100, Math.max(0, (elapsed / maxMs) * 100));
  return { value, label };
}

export function WorkflowBranch({
  branch,
  actions,
  onExecute,
  isLoading,
  doctype,
  name,
}: WorkflowBranchProps) {
  const variant = STYLE_VARIANT[branch.style] ?? "outline";
  const sla = slaProgress(branch.sla_deadline);
  const branchActions = actions.filter(
    (a) => a.branch_name === branch.branch || a.branch_name === "",
  );

  return (
    <div className="flex items-center gap-2">
      {branch.branch && <Badge variant="secondary">{branch.branch}</Badge>}
      <Badge variant={variant}>{branch.state}</Badge>
      {sla && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Progress value={sla.value} className="h-1.5 w-16" />
              <Badge variant={sla.value >= 100 ? "destructive" : "outline"}>
                {sla.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Deadline: {branch.sla_deadline ? new Date(branch.sla_deadline).toLocaleString() : "None"}
          </TooltipContent>
        </Tooltip>
      )}
      <div className="ms-auto flex gap-2">
        {branchActions.map((action) => (
          <WorkflowActionButton
            key={action.action + action.branch_name}
            action={action}
            onExecute={onExecute}
            isLoading={isLoading}
            doctype={doctype}
            name={name}
          />
        ))}
      </div>
    </div>
  );
}
