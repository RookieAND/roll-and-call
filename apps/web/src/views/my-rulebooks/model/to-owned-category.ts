import {
  CERT_STATE,
  RULEBOOK_KIND_GROUP,
  SET_STATUS,
  setStatus,
  type EditionSet,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

export interface OwnedBook {
  key: string;
  title: string;
  meta: string;
  badge: { label: string; palette: "success" | "gray" };
}

export interface OwnedCategory {
  key: string;
  title: string;
  sub: string;
  badge: { label: string; palette: "success" | "primary" };
  books: OwnedBook[];
}

const bookTitle = (book: MyRulebook) => `${book.shortName} ${book.edition}`.trim();

// 인증한 책이 있는 카테고리 한 장. 열 수 있는 판본이 있으면 완료, 아니면 남은 기본 룰북을 알려 준다.
// 펼치면 인증한 책과, 일부만 인증한 판본의 남은 기본 룰북이 나온다.
export function toOwnedCategory({
  categoryId,
  rulebooks,
  sets,
}: {
  categoryId: string;
  rulebooks: MyRulebook[];
  sets: EditionSet[];
}): OwnedCategory {
  const books = rulebooks.filter((book) => book.categoryId === categoryId);
  const categorySets = sets.filter((set) => set.categoryId === categoryId);
  const earned = categorySets.filter((set) => set.earned);
  const partial = categorySets
    .map((set) => ({ set, ...setStatus(set) }))
    .filter(({ status }) => status === SET_STATUS.partial);
  const editions = [...new Set(earned.flatMap((set) => [set.edition, ...set.covers]))].filter(
    Boolean,
  );
  const [nearest] = partial.toSorted((left, right) => left.missing.length - right.missing.length);
  const sub =
    earned.length > 0
      ? editions.length > 0
        ? `${editions.join(" · ")} 구인을 열 수 있습니다`
        : "구인을 열 수 있습니다"
      : nearest
        ? `${nearest.missing.length}권만 더 인증하면 ${nearest.set.edition || nearest.set.label} GM이 될 수 있습니다`
        : "기본 룰북을 인증하면 GM이 될 수 있습니다";
  const remaining = new Set(partial.flatMap(({ missing }) => missing));
  return {
    key: categoryId,
    title: books[0]?.categoryName ?? "",
    sub,
    badge:
      earned.length > 0
        ? { label: "완료됨", palette: "success" }
        : { label: "인증 중", palette: "primary" },
    books: books
      .filter((book) => book.state === CERT_STATE.certified || remaining.has(book))
      .map((book) => {
        const certified = book.state === CERT_STATE.certified;
        const kind = RULEBOOK_KIND_GROUP[book.kind];
        return {
          key: book.id,
          title: bookTitle(book),
          meta: certified ? `${kind} · ${toKst(book.stateAt!).format("MM.DD")} 인증` : kind,
          badge: certified
            ? { label: "인증됨", palette: "success" }
            : { label: book.state === CERT_STATE.pending ? "심사 중" : "미인증", palette: "gray" },
        };
      }),
  };
}
