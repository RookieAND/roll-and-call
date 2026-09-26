// 신청 1단계(책 고르기)는 고른 책을 미리 담아 두고, 2단계(사진)는 바로 올리는 화면으로 간다.
export function certApplyHref(rulebookIds: string[], step: "books" | "photos" = "books") {
  const query = new URLSearchParams(rulebookIds.map((id) => ["rulebook", id]));
  const path = step === "photos" ? "/me/rulebooks/apply/photos" : "/me/rulebooks/apply";
  return query.size > 0 ? `${path}?${query}` : path;
}
