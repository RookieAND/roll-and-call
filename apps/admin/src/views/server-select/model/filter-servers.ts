import type { MyServer } from "@/shared/server";

import { SERVER_FILTER, type ServerFilter } from "./server-filter";

export function filterServers({
  servers,
  query,
  filter,
}: {
  servers: MyServer[];
  query: string;
  filter: ServerFilter | undefined;
}) {
  const keyword = query.trim().toLowerCase();
  return servers.filter(
    (server) =>
      (!keyword || server.name.toLowerCase().includes(keyword) || server.slug.includes(keyword)) &&
      (filter !== SERVER_FILTER.bot || !server.botConnected) &&
      (filter !== SERVER_FILTER.pending || server.pending > 0),
  );
}
