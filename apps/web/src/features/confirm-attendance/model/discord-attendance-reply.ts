export interface DiscordAttendanceReply {
  message: string;
  webUrl: string | null;
}

export function discordAttendanceReply(
  message: string,
  webUrl: string | null = null,
): DiscordAttendanceReply {
  return { message, webUrl };
}
