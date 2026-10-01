import { cache } from "react";

import { getBadgeFacts } from "@/shared/server";

export const loadMyBadgeFacts = cache((userId: string) => getBadgeFacts(userId));
