import type { ReactNode } from "react";

import { DISCORD } from "@/shared/lib";

export function Mention({ children, unknown }: { children: ReactNode; unknown?: boolean }) {
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
