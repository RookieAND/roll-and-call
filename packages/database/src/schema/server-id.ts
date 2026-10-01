import { uuid } from "drizzle-orm/pg-core";

import { servers } from "./servers";

// 서버별 표가 모두 쓰는 server_id 칸.
export const serverId = () =>
  uuid("server_id")
    .notNull()
    .references(() => servers.id);
