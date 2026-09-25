import type { RulebookKind } from "@roll-and-call/database";

// 폼이 들고 있는 값. 다른 이름은 쉼표로 이어 쓴 글자 그대로 둔다.
export interface RulebookDraft {
  name: string;
  edition: string;
  category: string;
  kind: RulebookKind;
  supersedesId: string | null;
  aliasesText: string;
  certRequired: boolean;
}
