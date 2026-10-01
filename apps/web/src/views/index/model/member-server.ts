import type { listMemberServers } from "@roll-and-call/database/servers";

export type MemberServer = Awaited<ReturnType<typeof listMemberServers>>[number];
