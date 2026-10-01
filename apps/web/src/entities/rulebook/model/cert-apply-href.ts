export function certApplyHref({
  rulebookIds,
  step = "books",
}: {
  rulebookIds: string[];
  step?: "books" | "photos";
}) {
  const query = new URLSearchParams(rulebookIds.map((id) => ["rulebook", id]));
  const path = step === "photos" ? "/me/rulebooks/apply/photos" : "/me/rulebooks/apply";
  return query.size > 0 ? `${path}?${query}` : path;
}
