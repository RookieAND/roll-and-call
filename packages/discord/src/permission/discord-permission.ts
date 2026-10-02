// https://discord.com/developers/docs/topics/permissions 의 비트 값.
export const DISCORD_PERMISSION = {
  administrator: 1n << 3n,
  viewChannel: 1n << 10n,
  sendMessages: 1n << 11n,
  manageRoles: 1n << 28n,
} as const;

export const DISCORD_CHANNEL_TYPE = {
  text: 0,
  announcement: 5,
  forum: 15,
} as const;
