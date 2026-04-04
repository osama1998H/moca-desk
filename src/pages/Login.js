import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { MocaApiError } from "@/api/client";
export function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    // If already authenticated, redirect immediately.
    if (isAuthenticated) {
        const returnTo = searchParams.get("returnTo") ?? "/desk/app";
        void navigate(returnTo, { replace: true });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            const returnTo = searchParams.get("returnTo") ?? "/desk/app";
            void navigate(returnTo, { replace: true });
        }
        catch (err) {
            if (err instanceof MocaApiError) {
                setError(err.message);
            }
            else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-gray-50", children: _jsxs("div", { className: "w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm", children: [_jsx("h1", { className: "mb-6 text-center text-2xl font-semibold text-gray-900", children: "Moca" }), error && (_jsx("div", { className: "mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700", children: error })), _jsxs("form", { onSubmit: (e) => void handleSubmit(e), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "mb-1 block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email", className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "mb-1 block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none", placeholder: "Enter your password" })] }), _jsx("button", { type: "submit", disabled: submitting, className: "w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50", children: submitting ? "Signing in..." : "Sign in" })] })] }) }));
}
