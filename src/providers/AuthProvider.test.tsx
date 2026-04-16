import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { AuthProvider } from "./AuthProvider";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/api/client";

describe("AuthProvider.restore", () => {
  beforeEach(() => {
    // Reset both the module-level state and localStorage.
    // Clearing localStorage alone does NOT reset client.ts' cached
    // accessToken/refreshToken variables — seeded at module import time.
    setAccessToken(null);
    setRefreshToken(null);
  });

  it("clears orphaned access token when no refresh token exists", async () => {
    // Reproduce the post-server-restart state: a stale access token is
    // still held in the module variable (and mirrored to localStorage),
    // but the refresh token is gone. setAccessToken() keeps the two in
    // sync so we don't depend on vitest module-load ordering.
    setAccessToken("stale.jwt.value");
    expect(getAccessToken()).toBe("stale.jwt.value");
    expect(localStorage.getItem("moca_access_token")).toBe("stale.jwt.value");
    expect(getRefreshToken()).toBeNull();

    render(<AuthProvider>{null}</AuthProvider>);

    await waitFor(() => {
      expect(getAccessToken()).toBeNull();
    });
    expect(localStorage.getItem("moca_access_token")).toBeNull();
  });
});
