import { DISCORD } from "@/shared/lib";

interface ForumTagChipProps {
  tag: { name: string; emoji: string | null };
}

export function ForumTagChip({ tag }: ForumTagChipProps) {
  return (
    <span
      className="inline-flex items-center gap-050 rounded-200 px-100 text-body4 leading-5 font-medium"
      style={{ background: DISCORD.embed, color: DISCORD.text }}
    >
      {tag.emoji ? <span aria-hidden>{tag.emoji}</span> : null}
      {tag.name}
    </span>
  );
}
