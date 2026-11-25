import type { RulebookKind } from "#db/schema";

import type { CoreMode } from "./core-modes";

export interface RulebookDescription {
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
  kind: RulebookKind;
  supersedes: string;
  includedSupplements: string[];
  aliases: string[];
  certRequired: boolean;
  miniRule: boolean;
  coreMode: CoreMode;
}
