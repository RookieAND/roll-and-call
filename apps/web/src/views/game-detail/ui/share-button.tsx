"use client";

import { IconButton } from "@trpg/ui";
import { Share2 } from "lucide-react";

import { toast } from "@/shared/ui";

export function ShareButton({ gameId }: { gameId: string }) {
  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/games/${gameId}`);
      toast.success("구인글 링크를 복사했습니다");
    } catch {
      toast.error("링크를 복사하지 못했습니다");
    }
  }

  return (
    <IconButton variant="ghost" aria-label="공유" onClick={share}>
      <Share2 size={20} />
    </IconButton>
  );
}
