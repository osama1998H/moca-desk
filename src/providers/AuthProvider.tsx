import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  post,
  MocaApiError,
} from "@/api/client";
import type { ApiResponse, TokenPair, User } from "@/api/types";

// ── Context shape ───────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

// ── JWT claim shape (matches pkg/auth/jwt.go AccessClaims) ──────────────────

interface AccessClaims {
  email: string;
  full_name: string;
  site: string;
  roles: string[];
  user_defaults?: Record<string, string>;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

function decodeUser(token: string): User {
  const claims = jwtDecode<AccessClaims>(token);
  return {
    email: claims.email,
    full_name: claims.full_name,
    site: claims.site,
    roles: claims.roles,
    user_defaults: claims.user_defaults,
  };
}

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply tokens to module-level state and decode user.
  const applyTokens = useCallback((pair: TokenPair) => {
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
        // Clear any orphaned access token seeded at module load from
        // localStorage. Without this, every subsequent request attaches
        // a stale Bearer header, including POST /auth/login.
        setAccessToken(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await post<ApiResponse<TokenPair>>("auth/refresh", {
          refresh_token: rt,
        });
        if (!cancelled) {
          applyTokens(res.data);
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, [applyTokens, clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await post<ApiResponse<TokenPair>>("auth/login", {
        email,
        password,
      });
      applyTokens(res.data);
    },
    [applyTokens],
  );

  const logout = useCallback(async () => {
    try {
      await post<unknown>("auth/logout");
    } catch (err) {
      // Ignore errors during logout (session may already be expired).
      if (!(err instanceof MocaApiError)) throw err;
    }
    clearAuth();
  }, [clearAuth]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
