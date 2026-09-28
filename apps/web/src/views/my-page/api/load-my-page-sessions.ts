import { cache } from "react";

import { loadMySessions } from "@/widgets/session-list";

export const loadMyPageSessions = cache(loadMySessions);
