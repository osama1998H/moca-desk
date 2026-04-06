import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";

interface ShortcutCardProps {
  config: Record<string, unknown>;
}

export function ShortcutCard({ config }: ShortcutCardProps) {
  const label = (config.label as string) ?? "Shortcut";
  const color = (config.color as string) ?? "#6b7280";
  const url =
    (config.url as string) ??
    (config.doctype ? `/desk/app/${config.doctype as string}` : "#");

  return (
    <Link
      to={url}
      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
    >
      <div className="flex items-center gap-3">
        <div
          className="size-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      <ArrowRightIcon className="size-4 text-gray-400 group-hover:text-gray-600" />
    </Link>
  );
}
