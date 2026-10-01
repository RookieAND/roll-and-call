import type { BookDraft } from "./book-draft";
import { OTHER_SELLER } from "./other-seller";

export function sellerName(draft: Pick<BookDraft, "seller" | "sellerOther">) {
  if (draft.seller === OTHER_SELLER) return draft.sellerOther.trim();
  return draft.seller;
}
