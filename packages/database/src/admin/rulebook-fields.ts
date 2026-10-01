import type { RulebookKind } from "../schema";

export interface RulebookFields {
  name: string;
  edition: string;
  category: string;
  kind: RulebookKind;
  supersedesId: string | null;
  aliases: string[];
  certRequired: boolean;
}
