import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { jwtDecode } from "jwt-decode";
import { setAccessToken, setRefreshToken, getRefreshToken, post, MocaApiError, } from "@/api/client";
const AuthContext = createContext(null);
function decodeUser(token) {
    const claims = jwtDecode(token);
    return {
        email: claims.email,
        full_name: claims.full_name,
        site: claims.site,
        roles: claims.roles,
        user_defaults: claims.user_defaults,
    };
}
// ── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Apply tokens to module-level state and decode user.
    const applyTokens = useCallback((pair) => {
        setAccessToken(pair.access_token);
        setRefreshToken(pair.refresh_token);
        setUser(decodeUser(pair.access_token));
    }, []);
    const clearAuth = useCallback(() => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    }, []);
    // Attempt session restoration on mount via refresh token / cookie.
    useEffect(() => {
        let cancelled = false;
        async function restore() {
            const rt = getRefreshToken();
            if (!rt) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await post("auth/refresh", {
                    refresh_token: rt,
                });
                if (!cancelled) {
                    applyTokens(res.data);
                }
            }
            catch {
                if (!cancelled)
                    clearAuth();
            }
            finally {
                if (!cancelled)
                    setIsLoading(false);
            }
        }
        void restore();
        return () => {
            cancelled = true;
        };
    }, [applyTokens, clearAuth]);
    const login = useCallback(async (email, password) => {
        const res = await post("auth/login", {
            email,
            password,
        });
        applyTokens(res.data);
    }, [applyTokens]);
    const logout = useCallback(async () => {
        try {
            await post("auth/logout");
        }
        catch (err) {
            // Ignore errors during logout (session may already be expired).
            if (!(err instanceof MocaApiError))
                throw err;
        }
        clearAuth();
    }, [clearAuth]);
    const value = useMemo(() => ({
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
    }), [user, isLoading, login, logout]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
// ── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
