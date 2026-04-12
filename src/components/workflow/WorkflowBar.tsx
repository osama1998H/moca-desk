import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { WorkflowBranch } from "./WorkflowBranch";
import { useWorkflowState, useWorkflowTransition } from "./useWorkflow";

interface WorkflowBarProps {
  doctype: string;
  name: string;
}

export function WorkflowBar({ doctype, name }: WorkflowBarProps) {
  const { data, isLoading, error } = useWorkflowState(doctype, name);
  const transition = useWorkflowTransition(doctype, name);

  if (error) return null;
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!data) return null;

  const { status, actions } = data;

  function handleExecute(action: string, comment: string, branch: string) {
    transition.mutate({
      action,
      comment: comment || undefined,
      branch: branch || undefined,
    });
  }

  if (!status.is_parallel) {
    const branch = status.branches[0];
    if (!branch) return null;
    return (
      <Card>
        <CardHeader>
          <WorkflowBranch
            branch={branch}
            actions={actions}
            onExecute={handleExecute}
            isLoading={transition.isPending}
            doctype={doctype}
            name={name}
          />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-4">
        {status.branches.map((branch, idx) => (
          <div key={branch.branch}>
            {idx > 0 && <Separator className="mb-3" />}
            <WorkflowBranch
              branch={branch}
              actions={actions}
              onExecute={handleExecute}
              isLoading={transition.isPending}
              doctype={doctype}
              name={name}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
