// ── Error class ─────────────────────────────────────────────────────────────
export class MocaApiError extends Error {
    code;
    status;
    details;
    constructor(status, body) {
        super(body.message);
        this.name = "MocaApiError";
        this.code = body.code;
        this.status = status;
        this.details = body.details;
    }
}
// ── Token / site state (module-level, not in localStorage) ──────────────────
let accessToken = null;
let refreshToken = null;
let siteName = import.meta.env.VITE_MOCA_SITE ?? "";
export function setAccessToken(token) {
    accessToken = token;
}
export function setRefreshToken(token) {
    refreshToken = token;
}
export function setSite(site) {
    siteName = site;
}
export function getAccessToken() {
    return accessToken;
}
export function getRefreshToken() {
    return refreshToken;
}
// ── Refresh mutex ───────────────────────────────────────────────────────────
let refreshPromise = null;
async function attemptRefresh() {
    if (!refreshToken)
        return false;
    // Deduplicate concurrent refresh attempts.
    if (refreshPromise)
        return refreshPromise;
    refreshPromise = (async () => {
        try {
            const res = await fetch("/api/v1/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (!res.ok)
                return false;
            const json = (await res.json());
            accessToken = json.data.access_token;
            refreshToken = json.data.refresh_token;
            return true;
        }
        catch {
            return false;
        }
        finally {
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}
// ── Core request function ───────────────────────────────────────────────────
async function request(method, path, body, retry = true) {
    const url = path.startsWith("/") ? path : `/api/v1/${path}`;
    const headers = {};
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (siteName) {
        headers["X-Moca-Site"] = siteName;
    }
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const init = {
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
            return request(method, path, body, false);
        }
    }
    // Handle 204 No Content (e.g., DELETE).
    if (res.status === 204) {
        return undefined;
    }
    const json = await res.json();
    if (!res.ok) {
        const err = json;
        throw new MocaApiError(res.status, err.error);
    }
    return json;
}
// ── Public API ──────────────────────────────────────────────────────────────
export function get(path, params) {
    let url = path;
    if (params) {
        const qs = new URLSearchParams(params).toString();
        if (qs)
            url += `?${qs}`;
    }
    return request("GET", url);
}
export function post(path, body) {
    return request("POST", path, body);
}
export function put(path, body) {
    return request("PUT", path, body);
}
export function del(path) {
    return request("DELETE", path);
}
