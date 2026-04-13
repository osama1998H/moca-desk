import { useCallback, useRef, useState } from "react";
import type { Command } from "@/components/builder-kit/types";

export interface CommandHistoryAPI {
  execute(cmd: Command): void;
  undo(): void;
  redo(): void;
  canUndo: boolean;
  canRedo: boolean;
  history: Command[];
}

export function useCommandHistory(): CommandHistoryAPI {
  const undoStack = useRef<Command[]>([]);
  const redoStack = useRef<Command[]>([]);
  // A counter used solely to trigger re-renders when stacks change.
  const [, setTick] = useState(0);

  const bump = useCallback(() => setTick((t) => t + 1), []);

  const execute = useCallback(
    (cmd: Command) => {
      cmd.execute();
      undoStack.current.push(cmd);
      redoStack.current = [];
      bump();
    },
    [bump],
  );

  const undo = useCallback(() => {
    const cmd = undoStack.current.pop();
    if (!cmd) return;
    cmd.undo();
    redoStack.current.push(cmd);
    bump();
  }, [bump]);

  const redo = useCallback(() => {
    const cmd = redoStack.current.pop();
    if (!cmd) return;
    cmd.execute();
    undoStack.current.push(cmd);
    bump();
  }, [bump]);

  return {
    execute,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    history: [...undoStack.current],
  };
}
