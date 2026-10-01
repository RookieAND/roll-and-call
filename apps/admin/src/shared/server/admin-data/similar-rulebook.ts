import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import type { Rulebook } from "./types";

export function similarRulebook(name: string, list: Rulebook[]) {
  const needle = name.trim().toLowerCase();
  const match = list.find((rulebook) =>
    [rulebookLabel(rulebook), rulebook.name, ...rulebook.aliases].some((text) => {
      const hay = text.toLowerCase();
      return hay.includes(needle) || needle.includes(hay);
    }),
  );
  return match ? rulebookLabel(match) : undefined;
}
