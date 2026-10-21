import type { RulebookKind } from "#db/schema";

export interface RulebookFields {
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
  kind: RulebookKind;
  supersedesId: string | null;
  // 기본 룰북이 포함하는 서플리먼트. 서플리먼트·핸드북이면 비운다.
  includedSupplementIds: string[];
  aliases: string[];
  certRequired: boolean;
  // 추가할 때는 새 카테고리를 만들 때만 쓴다. 수정할 때는 룰북의 카테고리 값을 바꾼다.
  miniRule?: boolean;
}
