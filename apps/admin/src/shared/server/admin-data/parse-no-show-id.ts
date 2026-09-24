export function parseNoShowId(id: string) {
  const [gameId = "", userId = ""] = id.split("_");
  return { gameId, userId };
}
