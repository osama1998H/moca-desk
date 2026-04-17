import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocTypeEntryDialog } from "./DocTypeEntryDialog";
import * as client from "@/api/client";

describe("DocTypeEntryDialog", () => {
  beforeEach(() => {
    vi.spyOn(client, "get").mockImplementation(async (path: string) => {
      if (path === "dev/apps") return { data: [] };
      if (path === "dev/doctype") return { data: [] };
      throw new client.MocaApiError(404, { code: "NOT_FOUND", message: "x" });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the landing by default", () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    expect(screen.getByText(/create new doctype/i)).toBeTruthy();
    expect(screen.getByText(/edit existing doctype/i)).toBeTruthy();
  });

  it("does not close on Escape", () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    fireEvent.keyDown(document.body, { key: "Escape" });
    // Landing still visible
    expect(screen.getByText(/create new doctype/i)).toBeTruthy();
  });

  it("switches to Create view when the Create card is clicked", async () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    fireEvent.click(screen.getByText(/create new doctype/i));
    await waitFor(() =>
      expect(screen.getByLabelText(/^name$/i)).toBeTruthy(),
    );
  });

  it("switches to Open view when the Open card is clicked", async () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    fireEvent.click(screen.getByText(/edit existing doctype/i));
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/search/i)).toBeTruthy(),
    );
  });

  it("Back from Create view returns to Landing", async () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    fireEvent.click(screen.getByText(/create new doctype/i));
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toBeTruthy());

    fireEvent.click(screen.getByLabelText(/back/i));
    await waitFor(() =>
      expect(screen.getByText(/edit existing doctype/i)).toBeTruthy(),
    );
  });

  it("Back from Open view returns to Landing", async () => {
    render(
      <DocTypeEntryDialog open onStage={() => {}} onOpenExisting={() => {}} />,
    );
    fireEvent.click(screen.getByText(/edit existing doctype/i));
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/search/i)).toBeTruthy(),
    );

    fireEvent.click(screen.getByLabelText(/back/i));
    await waitFor(() =>
      expect(screen.getByText(/create new doctype/i)).toBeTruthy(),
    );
  });
});
