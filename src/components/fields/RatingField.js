import { jsx as _jsx } from "react/jsx-runtime";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
const MAX_STARS = 5;
export function RatingField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const rating = typeof value === "number" ? value : 0;
    // Rating is stored as a fraction (0-1), displayed as stars (0-5)
    const starCount = Math.round(rating * MAX_STARS);
    function handleClick(star) {
        if (readOnly)
            return;
        // If clicking same star, toggle off
        const newValue = star === starCount ? 0 : star;
        onChange(newValue / MAX_STARS);
    }
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx("div", { className: "flex items-center gap-0.5", children: Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((star) => (_jsx("button", { type: "button", onClick: () => handleClick(star), disabled: readOnly, className: cn("p-0.5 transition-colors", readOnly ? "cursor-default" : "cursor-pointer hover:text-amber-400"), children: _jsx(StarIcon, { className: cn("size-5", star <= starCount
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground") }) }, star))) }) }));
}
export default RatingField;
