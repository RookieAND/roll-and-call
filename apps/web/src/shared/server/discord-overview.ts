// Discord description 상한(4096)에 맞춰 자른다.
export function discordOverview(synopsis: string | null): string | undefined {
  if (!synopsis) return undefined;
  const body = synopsis.length > 4000 ? `${synopsis.slice(0, 4000)}…` : synopsis;
  return `**개요**\n${body}`;
}
