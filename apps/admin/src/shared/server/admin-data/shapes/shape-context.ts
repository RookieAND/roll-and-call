import type { AdminTables } from "@roll-and-call/database/moderation";

import type { AdminShapes } from "../types";

// 모양을 만들 때 쓰는 입구. tables에는 그 모양이 선언한 표만 들어 있다.
export interface ShapeContext {
  tables: AdminTables;
  now: number;
  nicknameOf: (id: string | null) => string;
  rulebookLabelOf: (id: string) => string | undefined;
  shape: <Key extends keyof AdminShapes>(key: Key) => AdminShapes[Key];
}
