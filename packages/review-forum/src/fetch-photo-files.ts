import type { DiscordFile } from "@roll-and-call/discord";

// 받아지지 않은 사진은 빼고 올린다. 게시글 자체를 막지는 않는다.
export async function fetchPhotoFiles(photos: { url: string; name: string }[]) {
  const files = await Promise.all(
    photos.map(async ({ url, name }): Promise<DiscordFile | null> => {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        return response.ok ? { name, blob: await response.blob() } : null;
      } catch {
        return null;
      }
    }),
  );
  return files.filter((file) => file !== null);
}
