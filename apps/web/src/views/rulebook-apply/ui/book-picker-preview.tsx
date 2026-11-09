import type { MyRulebook } from "@/entities/rulebook";

import { BookPicker } from "./book-picker";

const CATEGORIES = ["크툴루의 부름", "던전 앤 드래곤", "소드 월드", "패스파인더"];
const NAMES = ["수호자 룰북", "탐사자 룰북", "서플리먼트 A", "서플리먼트 B"];
const BOOKS: MyRulebook[] = Array.from({ length: 16 }, (_, index) => {
  const categoryName = CATEGORIES[Math.floor(index / 4)]!;
  const shortName = NAMES[index % 4]!;
  return {
    id: `preview-${index}`,
    name: `${categoryName} ${shortName}`,
    shortName,
    label: `${categoryName} ${shortName} 7판`,
    edition: "7판",
    aliases: [],
    certRequired: true,
    kind: index % 4 < 2 ? "core" : "supplement",
    categoryId: `category-${Math.floor(index / 4)}`,
    categoryName,
    supersedesId: null,
    includedInId: null,
    homebrew: null,
    state: null,
    stateAt: null,
    latestApplication: null,
    rejection: null,
    unlockedBy: null,
  };
});

export function BookPickerPreview() {
  return (
    <div className="desktop:ml-56">
      <BookPicker rulebooks={BOOKS} initialRulebookIds={[]} />
    </div>
  );
}
