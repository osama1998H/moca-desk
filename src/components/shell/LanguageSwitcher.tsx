import { useI18n } from "@/providers/I18nProvider";
import { useDocList } from "@/providers/DocProvider";
import { useDocUpdate } from "@/providers/DocProvider";
import { useAuth } from "@/providers/AuthProvider";
import { LanguagesIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LanguageItem {
  name: string;
  language_name: string;
  direction: string;
  enabled: number;
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const { user } = useAuth();

  const { data: langData } = useDocList("Language", {
    fields: ["name", "language_name", "direction", "enabled"],
    filters: [["enabled", "=", true]],
    limit: 50,
  });

  const updateUser = useDocUpdate("User", user?.email ?? "");

  const languages: LanguageItem[] = (langData?.data ?? []).map((d) => ({
    name: String(d.name ?? ""),
    language_name: String(d.language_name ?? ""),
    direction: String(d.direction ?? "ltr"),
    enabled: Number(d.enabled ?? 0),
  }));

  function handleSelect(lang: string) {
    setLanguage(lang);
    // Persist to User document (best-effort, JWT updates on next refresh).
    if (user?.email) {
      void updateUser.mutateAsync({ language: lang });
    }
  }

  const currentCode = language.toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <LanguagesIcon className="size-4" />
          <span className="text-xs font-medium">{currentCode}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        {languages.map((lang) => (
          <button
            key={lang.name}
            type="button"
            onClick={() => handleSelect(lang.name)}
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              language === lang.name && "bg-accent",
            )}
          >
            <CheckIcon
              className={cn(
                "size-4",
                language === lang.name ? "opacity-100" : "opacity-0",
              )}
            />
            <span>{lang.language_name}</span>
          </button>
        ))}
        {languages.length === 0 && (
          <div className="px-2 py-3 text-center text-sm text-muted-foreground">
            {t("No languages available")}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
