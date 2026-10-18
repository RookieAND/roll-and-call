import { getMemberNickname } from "@roll-and-call/database/profiles";

export async function memberName({ serverId, userId }: { serverId: string; userId: string }) {
  return `**${(await getMemberNickname({ serverId, userId })) ?? "?"}**`;
}
