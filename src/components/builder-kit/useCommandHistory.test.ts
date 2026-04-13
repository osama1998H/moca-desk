import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCommandHistory } from "@/components/builder-kit/useCommandHistory";
import type { Command } from "@/components/builder-kit/types";

function makeCommand(id: string, label = "cmd"): Command & { executeMock: ReturnType<typeof vi.fn>; undoMock: ReturnType<typeof vi.fn> } {
  const executeMock = vi.fn();
  const undoMock = vi.fn();
  return {
    id,
    label,
    execute: executeMock,
    undo: undoMock,
    executeMock,
    undoMock,
  };
}

describe("useCommandHistory", () => {
  it("executes a command and adds to undo stack", () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = makeCommand("1");

    act(() => {
      result.current.execute(cmd);
    });

    expect(cmd.executeMock).toHaveBeenCalledTimes(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("undoes the last command", () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = makeCommand("1");

    act(() => {
      result.current.execute(cmd);
    });
    act(() => {
      result.current.undo();
    });

    expect(cmd.undoMock).toHaveBeenCalledTimes(1);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("redoes after undo", () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = makeCommand("1");

    act(() => {
      result.current.execute(cmd);
    });
    act(() => {
      result.current.undo();
    });
    act(() => {
      result.current.redo();
    });

    // execute called twice: initial execute + redo
    expect(cmd.executeMock).toHaveBeenCalledTimes(2);
    expect(result.current.canRedo).toBe(false);
  });

  it("clears redo stack on new execute", () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd1 = makeCommand("1");
    const cmd2 = makeCommand("2");

    act(() => {
      result.current.execute(cmd1);
    });
    act(() => {
      result.current.undo();
    });

    // At this point canRedo should be true
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.execute(cmd2);
    });

    expect(result.current.canRedo).toBe(false);
  });

  it("handles undo on empty stack without crashing", () => {
    const { result } = renderHook(() => useCommandHistory());

    expect(() => {
      act(() => {
        result.current.undo();
      });
    }).not.toThrow();
  });

  it("handles redo on empty stack without crashing", () => {
    const { result } = renderHook(() => useCommandHistory());

    expect(() => {
      act(() => {
        result.current.redo();
      });
    }).not.toThrow();
  });
});
