import { createContext, useContext } from "react";
import { Band, Lang, Line, Tier, UiText, format, resolveTiered } from "./i18n/types";
import { UI, UiKey } from "./content/ui";
import { ITEM_NAMES } from "./content/itemNames";
import { InputMode } from "./game/input";

export interface AppContextValue {
  lang: Lang;
  tier: Tier;
  band: Band;
  audio: boolean;
  inputMode: InputMode;
}

export const AppContext = createContext<AppContextValue>({
  lang: "en",
  tier: "T2",
  band: "3-5",
  audio: true,
  inputMode: "mouse",
});

export function useApp() {
  const ctx = useContext(AppContext);

  const ui = (key: UiKey, vars?: Record<string, string | number>, lang: Lang = ctx.lang) =>
    format(UI[key][lang], vars);

  const pick = (text: UiText, lang: Lang = ctx.lang) => text[lang];

  const line = (l: Line, vars?: Record<string, string | number>, lang: Lang = ctx.lang) =>
    format(resolveTiered(l[lang], ctx.tier).text, vars);

  /** Text plus the tier it came from (for audio file lookup). */
  const lineWithTier = (l: Line, lang: Lang = ctx.lang) => resolveTiered(l[lang], ctx.tier);

  const itemName = (itemId: string, fallback = "") => ITEM_NAMES[itemId]?.[ctx.lang] ?? fallback;

  return { ...ctx, ui, pick, line, lineWithTier, itemName };
}
