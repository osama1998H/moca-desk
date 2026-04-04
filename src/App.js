import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { router } from "@/router";
export function App() {
    return _jsx(RouterProvider, { router: router });
}
