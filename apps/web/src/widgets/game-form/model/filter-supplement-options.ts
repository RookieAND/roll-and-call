import { supplementNameKey } from "@roll-and-call/database/games/model";

import type { SupplementOption } from "@/entities/rulebook";

export function filterSupplementOptions({
  options,
  query,
}: {
  options: SupplementOption[];
  query: string;
}) {
  const key = supplementNameKey(query);
  if (!key) return options;
  return options.filter((option) => supplementNameKey(option.name).includes(key));
}
