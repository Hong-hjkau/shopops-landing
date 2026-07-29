import type { Lang } from "./i18n.ts";

export const LANGS = ["zh-Hant", "zh-Hans", "en"] as const satisfies readonly Lang[];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export function parseQueryLang(
  value: string | string[] | undefined,
): Lang | undefined {
  return isLang(value) ? value : undefined;
}

export function resolveInitialLang(
  queryLang: unknown,
  storedLang: unknown,
): Lang {
  if (isLang(queryLang)) return queryLang;
  return isLang(storedLang) ? storedLang : "en";
}
