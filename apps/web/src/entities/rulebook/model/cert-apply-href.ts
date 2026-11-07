export function certApplyHref({
  rulebookIds,
  step = "books",
}: {
  rulebookIds: string[];
  step?: "books" | "photos";
}) {
  const path = step === "photos" ? "/me/rulebooks/apply/photos" : "/me/rulebooks/apply";
  const query = new URLSearchParams(rulebookIds.map((id) => ["rulebook", id]));
  if (query.size === 0 && step === "books") query.set("step", "books");
  return query.size > 0 ? `${path}?${query}` : path;
}
