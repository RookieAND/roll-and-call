import { richTextToMarkdown } from "@/shared/lib";

// Discord description 상한(4096)에 맞춰 자른다.
export function discordOverview(synopsis: string | null): string | undefined {
  if (!synopsis) return undefined;
  const markdown = richTextToMarkdown(synopsis);
  if (!markdown) return undefined;
  const body = markdown.length > 4000 ? `${markdown.slice(0, 4000)}…` : markdown;
  return `**개요**\n${body}`;
}
