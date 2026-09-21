import { Avatar, HStack, IconButton, Text } from "@trpg/ui";
import { X } from "lucide-react";

import type { PreConfirmedPlayer } from "@/features/write-game";

interface PreConfirmedRowProps {
  player: PreConfirmedPlayer;
  onRemove: () => void;
}

export function PreConfirmedRow({ player, onRemove }: PreConfirmedRowProps) {
  return (
    <HStack align="center" gap="125" render={<li />} className="min-h-13 px-150 py-100">
      <Avatar src={player.avatarUrl} name={player.username} size="md" />
      <div className="min-w-0 flex-1">
        <Text truncate typography="subtitle2" className="block">
          {player.username}
        </Text>
        <Text truncate typography="body4" foreground="muted" className="mt-025 block">
          {player.bio ?? "소개를 아직 쓰지 않았습니다"}
        </Text>
      </div>
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
