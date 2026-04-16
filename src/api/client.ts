import type {
  ApiErrorBody,
  ApiErrorResponse,
  ApiResponse,
  TokenPair,
} from "./types";

// ── Error class ─────────────────────────────────────────────────────────────

export class MocaApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: ApiErrorBody["details"];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "MocaApiError";
    this.code = body.code;
    this.status = status;
    this.details = body.details;
  }
}

// ── Token / site state (persisted to localStorage for reload survival) ───────

let accessToken: string | null = localStorage.getItem("moca_access_token");
let refreshToken: string | null = localStorage.getItem("moca_refresh_token");
let siteName: string = import.meta.env.VITE_MOCA_SITE ?? "";

// ── Language state (set by I18nProvider) ────────────────────────────────────

let languageGetter: () => string = () => "en";

export function setLanguageGetter(fn: () => string): void {
  languageGetter = fn;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) {
    localStorage.setItem("moca_access_token", token);
  } else {
    localStorage.removeItem("moca_access_token");
  }
}

export function setRefreshToken(token: string | null): void {
  refreshToken = token;
  if (token) {
    localStorage.setItem("moca_refresh_token", token);
  } else {
    localStorage.removeItem("moca_refresh_token");
  }
}

export function setSite(site: string): void {
  siteName = site;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

// ── Refresh mutex ───────────────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (!refreshToken) return false;

  // Deduplicate concurrent refresh attempts.
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return false;

      const json = (await res.json()) as ApiResponse<TokenPair>;
      accessToken = json.data.access_token;
      refreshToken = json.data.refresh_token;
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Core request function ───────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retry = true,
): Promise<T> {
  const url = path.startsWith("/") ? path : `/api/v1/${path}`;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  if (siteName) {
    headers["X-Moca-Site"] = siteName;
  }
  headers["Accept-Language"] = languageGetter();
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  if (import.meta.env.DEV) {
    console.debug(`[moca] ${method} ${url}`);
  }

  const res = await fetch(url, init);

  if (import.meta.env.DEV) {
    console.debug(`[moca] ${method} ${url} → ${String(res.status)}`);
  }

  // Handle 401: attempt a single token refresh then retry.
  if (res.status === 401 && retry) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return request<T>(method, path, body, false);
    }
  }

  // Handle 204 No Content (e.g., DELETE).
  if (res.status === 204) {
    return undefined as T;
  }

  const json: unknown = await res.json();

  if (!res.ok) {
    const err = json as ApiErrorResponse;
    throw new MocaApiError(res.status, err.error);
  }

  return json as T;
}

// ── Public API ──────────────────────────────────────────────────────────────

export function get<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  let url = path;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }
  return request<T>("GET", url);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PUT", path, body);
}

export function del(path: string): Promise<void> {
  return request<void>("DELETE", path);
}
