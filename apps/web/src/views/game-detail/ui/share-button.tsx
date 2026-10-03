"use client";

import { IconButton } from "@roll-and-call/ui";
import { Share2 } from "lucide-react";

import { useServerPath } from "@/shared/lib";
import { toast } from "@/shared/ui";

interface ShareButtonProps {
  gameId: string;
}

export function ShareButton({ gameId }: ShareButtonProps) {
  const toServerPath = useServerPath();

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${toServerPath(`/games/${gameId}`)}`,
      );
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
