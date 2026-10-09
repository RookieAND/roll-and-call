import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";

import { isValueOf } from "@/shared/lib";

export const isRulebookKind = isValueOf(RULEBOOK_KIND);
