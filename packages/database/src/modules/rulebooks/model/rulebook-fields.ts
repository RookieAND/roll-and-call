import type { RulebookKind } from "#db/schema";

export interface RulebookFields {
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
  kind: RulebookKind;
  supersedesId: string | null;
  aliases: string[];
  certRequired: boolean;
  // 추가할 때는 새 카테고리를 만들 때만 쓴다. 수정할 때는 룰북의 카테고리 값을 바꾼다.
  miniRule?: boolean;
}
