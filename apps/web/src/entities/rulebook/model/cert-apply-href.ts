export function certApplyHref(rulebookIds: string[], step: "books" | "photos" = "books") {
  const query = new URLSearchParams(rulebookIds.map((id) => ["rulebook", id]));
  const path = step === "photos" ? "/me/rulebooks/apply/photos" : "/me/rulebooks/apply";
  return query.size > 0 ? `${path}?${query}` : path;
}
