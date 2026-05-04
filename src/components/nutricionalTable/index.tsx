import React, { useMemo } from "react";

export type NutritionalTableRow = {
  label: string;
  value: string;
};

export type NutritionalFactsByLang = {
  es?: NutritionalTableRow[];
  en?: NutritionalTableRow[];
  ca?: NutritionalTableRow[];
  [key: string]: NutritionalTableRow[] | undefined;
};

export type NutritionalFactsInput =
  | string
  | NutritionalTableRow[]
  | NutritionalFactsByLang
  | null
  | undefined;

export interface NutricionalTableProps {
  data?: NutritionalFactsInput;
  language?: "es" | "en" | "ca";
  title?: string;
  className?: string;
}

const splitToLines = (raw: string): string[] => {
  return raw
    .replace(/\r/g, "\n")
    .replace(/;/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
};

const normalizeLine = (line: string): string => {
  return line.replace(/^[-•*]\s+/, "").trim();
};

const parseLine = (line: string): NutritionalTableRow | null => {
  const normalized = normalizeLine(line);
  if (!normalized) return null;

  const match = normalized.match(/^(.+?)\s*[:=]\s*(.+)$/);
  if (match) {
    return { label: match[1].trim(), value: match[2].trim() };
  }

  const dashIdx = normalized.indexOf(" - ");
  if (dashIdx !== -1) {
    const label = normalized.slice(0, dashIdx).trim();
    const value = normalized.slice(dashIdx + 3).trim();
    if (label && value) return { label, value };
  }

  return { label: normalized, value: "" };
};

const normalizeRow = (row: unknown): NutritionalTableRow | null => {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const label = typeof r.label === "string" ? r.label.trim() : "";
  const value = typeof r.value === "string" ? r.value.trim() : "";
  if (!label) return null;
  return { label, value };
};

const parseJsonString = (raw: string): unknown => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
};

const pickLangRows = (
  data: NutritionalFactsByLang,
  language: "es" | "en" | "ca",
): NutritionalTableRow[] => {
  const list = data[language] ?? data.es ?? data.en ?? data.ca;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeRow).filter((r): r is NutritionalTableRow => !!r);
};

const toRows = (
  input: NutritionalFactsInput,
  language: "es" | "en" | "ca",
): NutritionalTableRow[] => {
  if (!input) return [];
  if (typeof input === "string") {
    const parsed = parseJsonString(input);
    if (parsed) return toRows(parsed as NutritionalFactsInput, language);
    const trimmed = input.trim();
    if (!trimmed) return [];
    return splitToLines(trimmed)
      .map((l) => parseLine(l))
      .filter((r): r is NutritionalTableRow => Boolean(r?.label));
  }
  if (Array.isArray(input)) {
    return input.map(normalizeRow).filter((r): r is NutritionalTableRow => !!r);
  }
  if (typeof input === "object") {
    return pickLangRows(input as NutritionalFactsByLang, language);
  }
  return [];
};

const NutricionalTable: React.FC<NutricionalTableProps> = ({
  data,
  language = "es",
  title = "Valores nutricionales",
  className,
}) => {
  const rows = useMemo(() => {
    return toRows(data, language);
  }, [data, language]);

  if (rows.length === 0) return null;

  return (
    <div className={className}>
      <div className="w-full border border-black/15 rounded-xl overflow-hidden bg-white">
        <div className="bg-black text-white px-4 py-3">
          <div className="text-sm font-extrabold uppercase tracking-wide">
            {title}
          </div>
        </div>

        <table className="w-full text-base md:text-lg">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.label}-${idx}`}
                className="border-t border-black/10"
              >
                <td className="px-4 py-3 font-semibold text-black w-[60%]">
                  {row.label}
                </td>
                <td className="px-4 py-3 text-black/80 text-right whitespace-nowrap">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutricionalTable;
