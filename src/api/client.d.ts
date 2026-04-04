import type { ApiErrorBody } from "./types";
export declare class MocaApiError extends Error {
    readonly code: string;
    readonly status: number;
    readonly details?: ApiErrorBody["details"];
    constructor(status: number, body: ApiErrorBody);
}
export declare function setAccessToken(token: string | null): void;
export declare function setRefreshToken(token: string | null): void;
export declare function setSite(site: string): void;
export declare function getAccessToken(): string | null;
export declare function getRefreshToken(): string | null;
export declare function get<T>(path: string, params?: Record<string, string>): Promise<T>;
export declare function post<T>(path: string, body?: unknown): Promise<T>;
export declare function put<T>(path: string, body?: unknown): Promise<T>;
export declare function del(path: string): Promise<void>;
