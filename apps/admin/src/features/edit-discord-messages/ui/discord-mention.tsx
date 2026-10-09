import type { ReactNode } from "react";

import { DISCORD } from "@/shared/lib";

interface MentionProps {
  children: ReactNode;
  unknown?: boolean;
}

export function Mention({ children, unknown }: MentionProps) {
  return (
    <span
      className="rounded-200 px-025 font-medium"
      style={{
        background: unknown ? DISCORD.unknownRole : DISCORD.mention,
        color: unknown ? DISCORD.muted : DISCORD.mentionText,
      }}
    >
      {children}
    </span>
  );
}
