import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CreateDocTypeForm } from "./CreateDocTypeForm";
import * as client from "@/api/client";

const appsResponse = {
  data: [
    { name: "acme", modules: ["crm", "sales"] },
    { name: "frappe", modules: ["core"] },
  ],
};

describe("CreateDocTypeForm", () => {
  beforeEach(() => {
    vi.spyOn(client, "get").mockImplementation(async (path: string) => {
      if (path === "dev/apps") return appsResponse;
      if (path.startsWith("dev/doctype/")) {
        // Default: name is available (404 → MocaApiError with status 404).
        throw new client.MocaApiError(404, { code: "NOT_FOUND", message: "not found" });
      }
      throw new Error(`unexpected path ${path}`);
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function fillName(value: string) {
    const name = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(name, { target: { value } });
    // Wait for debounced availability check
    await new Promise((r) => setTimeout(r, 400));
  }

  it("disables Save & Continue until name, app, and module are chosen", async () => {
    render(<CreateDocTypeForm onStage={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    const save = screen.getByRole("button", { name: /save & continue/i });
    expect(save).toBeDisabled();

    await fillName("Customer");
    fireEvent.change(screen.getByLabelText(/app/i), { target: { value: "acme" } });
    fireEvent.change(screen.getByLabelText(/module/i), { target: { value: "crm" } });

    await waitFor(() => expect(save).not.toBeDisabled());
  });

  it("changing App clears the Module selection", async () => {
    render(<CreateDocTypeForm onStage={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    fireEvent.change(screen.getByLabelText(/app/i), { target: { value: "acme" } });
    fireEvent.change(screen.getByLabelText(/module/i), { target: { value: "crm" } });
    expect((screen.getByLabelText(/module/i) as HTMLSelectElement).value).toBe("crm");

    fireEvent.change(screen.getByLabelText(/app/i), { target: { value: "frappe" } });
    expect((screen.getByLabelText(/module/i) as HTMLSelectElement).value).toBe("");
  });

  it("shows taken indicator when name-availability GET returns 200", async () => {
    vi.spyOn(client, "get").mockImplementation(async (path: string) => {
      if (path === "dev/apps") return appsResponse;
      if (path.startsWith("dev/doctype/")) return { data: {} };
      throw new Error("x");
    });

    render(<CreateDocTypeForm onStage={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    await fillName("Existing");
    await waitFor(() =>
      expect(screen.getByText(/name is taken/i)).toBeTruthy(),
    );
  });

  it("Submittable type maps to correct flags in staged payload", async () => {
    const onStage = vi.fn();
    render(<CreateDocTypeForm onStage={onStage} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    await fillName("Customer");
    fireEvent.change(screen.getByLabelText(/app/i), { target: { value: "acme" } });
    fireEvent.change(screen.getByLabelText(/module/i), { target: { value: "crm" } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "Submittable" } });

    fireEvent.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(onStage).toHaveBeenCalledTimes(1);
    const payload = onStage.mock.calls[0]![0];
    expect(payload.name).toBe("Customer");
    expect(payload.app).toBe("acme");
    expect(payload.module).toBe("crm");
    expect(payload.settings.is_submittable).toBe(true);
    expect(payload.settings.is_single).toBe(false);
    expect(payload.settings.is_child_table).toBe(false);
    expect(payload.settings.is_virtual).toBe(false);
    expect(payload.settings.track_changes).toBe(true);
    expect(payload.settings.naming_rule).toEqual({ rule: "uuid" });
  });

  it("Normal type leaves all kind flags false", async () => {
    const onStage = vi.fn();
    render(<CreateDocTypeForm onStage={onStage} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    await fillName("Thing");
    fireEvent.change(screen.getByLabelText(/app/i), { target: { value: "acme" } });
    fireEvent.change(screen.getByLabelText(/module/i), { target: { value: "crm" } });
    // Type default is Normal; don't change it.

    fireEvent.click(screen.getByRole("button", { name: /save & continue/i }));

    const payload = onStage.mock.calls[0]![0];
    expect(payload.settings.is_submittable).toBe(false);
    expect(payload.settings.is_single).toBe(false);
    expect(payload.settings.is_child_table).toBe(false);
    expect(payload.settings.is_virtual).toBe(false);
  });

  it("invokes onBack when back button clicked", async () => {
    const onBack = vi.fn();
    render(<CreateDocTypeForm onStage={() => {}} onBack={onBack} />);
    await waitFor(() => expect(screen.getByLabelText(/app/i)).toBeTruthy());

    fireEvent.click(screen.getByLabelText(/back/i));
    expect(onBack).toHaveBeenCalled();
  });
});
