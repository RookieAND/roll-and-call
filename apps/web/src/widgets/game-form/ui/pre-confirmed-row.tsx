import { HStack, IconButton } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { EMPTY_BIO_TEXT, ProfileRow } from "@/entities/profile";
import type { PreConfirmedPlayer } from "@/features/write-game";

interface PreConfirmedRowProps {
  player: PreConfirmedPlayer;
  onRemove: () => void;
}

export function PreConfirmedRow({ player, onRemove }: PreConfirmedRowProps) {
  return (
    <HStack align="center" gap="125" render={<li />} className="min-h-13 px-150 py-100">
      <ProfileRow
        name={player.username}
        avatarUrl={player.avatarUrl}
        subline={player.bio ?? EMPTY_BIO_TEXT}
      />
      <IconButton
        variant="ghost"
        aria-label={`${player.username} 빼기`}
        className="h-8 w-8 text-hint"
        onClick={onRemove}
      >
        <X size={15} strokeWidth={2.6} aria-hidden />
      </IconButton>
    </HStack>
  );
}
