import type { RulebookKind } from "#/schema";

export interface RulebookFields {
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
  kind: RulebookKind;
  supersedesId: string | null;
  aliases: string[];
  certRequired: boolean;
  // 새 카테고리를 만들 때만 쓴다. 이미 있는 카테고리의 값은 바꾸지 않는다.
  miniRule?: boolean;
}
