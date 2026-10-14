import { SUPPLEMENT_NAME_MAX, supplementNameKey } from "@roll-and-call/database/games/model";

import type { EditionSet } from "@/entities/rulebook";

import type { SupplementValue } from "./game-form";

// 직접 입력한 서플리먼트 이름이 쓸 수 없는 이유. 등록된 책이면 목록에서 고르게 해 인증을 건너뛰지 못하게 한다.
export function manualSupplementError({
  name,
  items,
  set,
}: {
  name: string;
  items: SupplementValue[];
  set: Pick<EditionSet, "cores" | "extras"> | null;
}) {
  const trimmed = name.trim();
  if (!trimmed) return "서플리먼트 이름을 적어 주세요.";
  if (trimmed.length > SUPPLEMENT_NAME_MAX) return `${SUPPLEMENT_NAME_MAX}자까지 적을 수 있습니다.`;
  const key = supplementNameKey(trimmed);
  const registered = [...(set?.cores ?? []), ...(set?.extras ?? [])].some((book) =>
    [book.name, book.label, book.shortName, ...book.aliases].some(
      (candidate) => supplementNameKey(candidate) === key,
    ),
  );
  if (registered) return "목록에 있는 서플리먼트입니다. 목록에서 골라 주세요.";
  if (items.some((item) => supplementNameKey(item.name) === key)) {
    return "이미 넣은 서플리먼트입니다.";
  }
  return null;
}
