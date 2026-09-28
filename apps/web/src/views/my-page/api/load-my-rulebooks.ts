import { cache } from "react";

import { toMyRulebooks } from "@/entities/rulebook";
import { getRulebookRecords } from "@/shared/server";

export const loadMyRulebooks = cache(async (userId: string) =>
  toMyRulebooks(await getRulebookRecords(userId)),
);
