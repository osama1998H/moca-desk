import { useState } from "react";
import { CheckIcon, XIcon, Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Field, FieldLabel } from "../ui/field";
import type { WorkflowAvailableAction } from "../../api/types";

interface WorkflowActionButtonProps {
  action: WorkflowAvailableAction;
  onExecute: (action: string, comment: string, branch: string) => void;
  isLoading: boolean;
  doctype: string;
  name: string;
}

const DESTRUCTIVE_ACTIONS = new Set(["Reject", "Cancel", "Decline"]);

export function WorkflowActionButton({
  action,
  onExecute,
  isLoading,
  doctype,
  name,
}: WorkflowActionButtonProps) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [comment, setComment] = useState("");

  const isDestructive = DESTRUCTIVE_ACTIONS.has(action.action);

  function handleClick() {
    if (action.require_comment) {
      setCommentOpen(true);
    } else if (isDestructive) {
      setConfirmOpen(true);
    } else {
      onExecute(action.action, "", action.branch_name);
    }
  }

  function handleCommentSubmit() {
    setCommentOpen(false);
    onExecute(action.action, comment, action.branch_name);
    setComment("");
  }

  function handleConfirm() {
    setConfirmOpen(false);
    onExecute(action.action, "", action.branch_name);
  }

  return (
    <>
      <Button
        variant={isDestructive ? "destructive" : "default"}
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
        ) : isDestructive ? (
          <XIcon data-icon="inline-start" />
        ) : (
          <CheckIcon data-icon="inline-start" />
        )}
        {action.action}
      </Button>

      <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
        <DialogContent>
          <DialogTitle>
            {action.action} — {doctype} {name}
          </DialogTitle>
          <DialogDescription>This action requires a comment.</DialogDescription>
          <Field>
            <FieldLabel htmlFor="workflow-comment">Comment</FieldLabel>
            <Textarea
              id="workflow-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCommentSubmit} disabled={comment.trim() === ""}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>{action.action} {doctype}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will move the document to &quot;{action.to_state}&quot; state.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {action.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
