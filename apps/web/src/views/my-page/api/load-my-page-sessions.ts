import { cache } from "react";

import { loadMySessions } from "@/widgets/session-list";

// react cache는 인자를 Object.is로 비교해서 객체 대신 값 둘을 받는다.
export const loadMyPageSessions = cache((serverId: string, userId: string) =>
  loadMySessions({ serverId, userId }),
);
