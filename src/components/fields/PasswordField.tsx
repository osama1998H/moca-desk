import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function PasswordField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <div className="relative">
        <Input
          id={fieldDef.name}
          type={visible ? "text" : "password"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={readOnly}
          maxLength={fieldDef.max_length}
          placeholder={fieldDef.label}
          className="pe-9"
          aria-invalid={!!error}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute inset-y-0 end-1 my-auto"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </FieldWrapper>
  );
}

export default PasswordField;
