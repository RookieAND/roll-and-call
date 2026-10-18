export const KICK_BLOCK = { serverOwner: "serverOwner", staff: "staff" } as const;
export type KickBlock = (typeof KICK_BLOCK)[keyof typeof KICK_BLOCK];

export function kickBlockCode({
  serverOwner,
  staff,
  self,
}: {
  serverOwner: boolean;
  staff: boolean;
  self: boolean;
}): KickBlock | null {
  if (serverOwner) return KICK_BLOCK.serverOwner;
  if (staff || self) return KICK_BLOCK.staff;
  return null;
}
