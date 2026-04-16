import { useCallback, useEffect, useMemo, useState } from "react";
import { get, post, put } from "@/api/client";
import { useDocList } from "@/providers/DocProvider";
import { useI18n } from "@/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  SaveIcon,
  Loader2Icon,
  FilterIcon,
} from "lucide-react";
import type { DocRecord, ListResponse } from "@/api/types";

interface TranslationRow {
  name?: string;
  source_text: string;
  language: string;
  translated_text: string;
  context: string;
  app: string;
  dirty: boolean;
}

export function TranslationTool() {
  const { t } = useI18n();

  const { data: langData } = useDocList("Language", {
    fields: ["name", "language_name", "enabled"],
    filters: [["enabled", "=", 1]],
    limit: 50,
  });
  const languages = (langData?.data ?? []).map((d) => ({
    code: String(d.name ?? ""),
    name: String(d.language_name ?? ""),
  }));

  const [selectedLang, setSelectedLang] = useState("");
  const [search, setSearch] = useState("");
  const [showUntranslated, setShowUntranslated] = useState(false);
  const [rows, setRows] = useState<TranslationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedLang && languages.length > 0) {
      const nonEn = languages.find((l) => l.code !== "en");
      const fallback = nonEn?.code ?? languages[0]?.code;
      if (fallback) {
        setSelectedLang(fallback);
      }
    }
  }, [languages, selectedLang]);

  useEffect(() => {
    if (!selectedLang || selectedLang === "en") return;
    setLoading(true);

    get<ListResponse<DocRecord>>(
      `resource/Translation`,
      {
        filters: JSON.stringify([["language", "=", selectedLang]]),
        fields: JSON.stringify(["name", "source_text", "translated_text", "context", "app"]),
        limit: "0",
      },
    )
      .then((res) => {
        const translatedData = res.data ?? [];
        const result: TranslationRow[] = translatedData.map((tr) => ({
          name: String(tr.name ?? ""),
          source_text: String(tr.source_text ?? ""),
          language: selectedLang,
          translated_text: String(tr.translated_text ?? ""),
          context: String(tr.context ?? ""),
          app: String(tr.app ?? ""),
          dirty: false,
        }));
        setRows(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLang]);

  const filtered = useMemo(() => {
    let result = rows;
    if (showUntranslated) {
      result = result.filter((r) => !r.translated_text);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.source_text.toLowerCase().includes(q) ||
          r.translated_text.toLowerCase().includes(q) ||
          r.context.toLowerCase().includes(q),
      );
    }
    return result;
  }, [rows, showUntranslated, search]);

  const totalCount = rows.length;
  const translatedCount = rows.filter((r) => r.translated_text).length;
  const coverage = totalCount > 0 ? Math.round((translatedCount / totalCount) * 100) : 0;

  const handleEdit = useCallback((rowIndex: number, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      const target = filtered[rowIndex];
      if (!target) return prev;
      const globalIndex = prev.findIndex(
        (r) => r.source_text === target.source_text && r.context === target.context,
      );
      const current = next[globalIndex];
      if (globalIndex >= 0 && current) {
        next[globalIndex] = { ...current, translated_text: value, dirty: true };
      }
      return next;
    });
  }, [filtered]);

  const handleSave = useCallback(async () => {
    const dirtyRows = rows.filter((r) => r.dirty);
    if (dirtyRows.length === 0) return;

    setSaving(true);
    try {
      for (const row of dirtyRows) {
        if (row.name) {
          await put(`resource/Translation/${row.name}`, {
            translated_text: row.translated_text,
          });
        } else {
          await post("resource/Translation", {
            source_text: row.source_text,
            language: row.language,
            translated_text: row.translated_text,
            context: row.context,
            app: row.app,
          });
        }
      }
      setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [rows]);

  const dirtyCount = rows.filter((r) => r.dirty).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t("Translation Tool")}</h1>
        <Button
          size="sm"
          onClick={() => void handleSave()}
          disabled={saving || dirtyCount === 0}
        >
          {saving ? (
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
          ) : (
            <SaveIcon data-icon="inline-start" />
          )}
          {t("Save")} {dirtyCount > 0 && `(${dirtyCount})`}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm"
        >
          {languages
            .filter((l) => l.code !== "en")
            .map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
        </select>

        <Input
          type="text"
          placeholder={t("Search...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />

        <Button
          variant={showUntranslated ? "default" : "outline"}
          size="sm"
          onClick={() => setShowUntranslated(!showUntranslated)}
        >
          <FilterIcon data-icon="inline-start" />
          {t("Untranslated")}
        </Button>

        <div className="ms-auto flex items-center gap-2">
          <Badge variant="secondary">
            {translatedCount}/{totalCount} ({coverage}%)
          </Badge>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${coverage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-2.5 font-medium text-foreground">{t("Source Text")}</th>
              <th className="px-4 py-2.5 font-medium text-foreground">{t("Context")}</th>
              <th className="px-4 py-2.5 font-medium text-foreground">{t("Translated Text")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  <Loader2Icon className="mx-auto size-5 animate-spin" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  {t("No records found")}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={`${row.source_text}-${row.context}-${i}`}
                  className={
                    row.dirty
                      ? "border-b border-border bg-amber-50 dark:bg-amber-950/20"
                      : !row.translated_text
                        ? "border-b border-border bg-muted/30"
                        : "border-b border-border"
                  }
                >
                  <td className="px-4 py-2 text-foreground">{row.source_text}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    <span className="text-xs">{row.context}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="text"
                      value={row.translated_text}
                      onChange={(e) => handleEdit(i, e.target.value)}
                      placeholder={row.source_text}
                      className="h-8"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TranslationTool;
