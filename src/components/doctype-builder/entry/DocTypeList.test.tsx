import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocTypeList } from "./DocTypeList";
import * as client from "@/api/client";

const sample = {
  data: [
    {
      name: "Customer",
      app: "acme",
      module: "crm",
      is_submittable: true,
      is_single: false,
      is_child_table: false,
      is_virtual: false,
    },
    {
      name: "Order Line",
      app: "acme",
      module: "crm",
      is_submittable: false,
      is_single: false,
      is_child_table: true,
      is_virtual: false,
    },
    {
      name: "User",
      app: "frappe",
      module: "core",
      is_submittable: false,
      is_single: false,
      is_child_table: false,
      is_virtual: false,
    },
  ],
};

describe("DocTypeList", () => {
  beforeEach(() => {
    vi.spyOn(client, "get").mockResolvedValue(sample);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders each doctype from the API", async () => {
    render(<DocTypeList onOpen={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());
    expect(screen.getByText("Order Line")).toBeTruthy();
    expect(screen.getByText("User")).toBeTruthy();
  });

  it("filters client-side by search query", async () => {
    render(<DocTypeList onOpen={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "order" } });

    await waitFor(() => {
      expect(screen.queryByText("Customer")).toBeNull();
      expect(screen.getByText("Order Line")).toBeTruthy();
      expect(screen.queryByText("User")).toBeNull();
    });
  });

  it("searches across name, module, and app", async () => {
    render(<DocTypeList onOpen={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("User")).toBeTruthy());

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "frappe" } });

    await waitFor(() => {
      expect(screen.queryByText("Customer")).toBeNull();
      expect(screen.getByText("User")).toBeTruthy();
    });
  });

  it("shows a no-match placeholder when nothing matches", async () => {
    render(<DocTypeList onOpen={() => {}} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "zzzznothing" } });

    await waitFor(() => {
      expect(screen.getByText(/no doctypes match/i)).toBeTruthy();
    });
  });

  it("shows the empty-state placeholder when the API returns []", async () => {
    vi.spyOn(client, "get").mockResolvedValue({ data: [] });
    render(<DocTypeList onOpen={() => {}} onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/no doctypes yet/i)).toBeTruthy();
    });
  });

  it("invokes onOpen with the doctype name on row click", async () => {
    const onOpen = vi.fn();
    render(<DocTypeList onOpen={onOpen} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());

    fireEvent.click(screen.getByText("Customer"));
    expect(onOpen).toHaveBeenCalledWith("Customer");
  });

  it("invokes onBack when the back button is clicked", async () => {
    const onBack = vi.fn();
    render(<DocTypeList onOpen={() => {}} onBack={onBack} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());

    fireEvent.click(screen.getByLabelText(/back/i));
    expect(onBack).toHaveBeenCalled();
  });

  it("invokes onOpen when Enter is pressed on a focused row", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DocTypeList onOpen={onOpen} onBack={() => {}} />);
    await waitFor(() => expect(screen.getByText("Customer")).toBeTruthy());

    const row = screen.getByRole("button", { name: /customer/i });
    row.focus();
    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledWith("Customer");
  });
});
