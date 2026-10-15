import type { MyServer } from "@/shared/server";

import { SERVER_FILTER, type ServerFilter } from "./server-filter";

export function serverFilterChips(servers: MyServer[]): {
  key: ServerFilter | undefined;
  label: string;
}[] {
  return [
    { key: undefined, label: `전체 ${servers.length}` },
    {
      key: SERVER_FILTER.bot,
      label: `봇 연결 끊김 ${servers.filter((server) => !server.botConnected).length}`,
    },
    {
      key: SERVER_FILTER.pending,
      label: `처리 대기 있음 ${servers.filter((server) => server.pending > 0).length}`,
    },
  ];
}
