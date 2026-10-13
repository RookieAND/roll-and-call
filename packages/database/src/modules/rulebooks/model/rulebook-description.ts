import type { RulebookKind } from "#/schema";

export interface RulebookDescription {
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
  kind: RulebookKind;
  supersedes: string;
  aliases: string[];
  certRequired: boolean;
}
