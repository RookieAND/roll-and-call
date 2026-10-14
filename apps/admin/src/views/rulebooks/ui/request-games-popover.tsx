"use client";

import { Button, Popover, Text, VStack } from "@roll-and-call/ui";

import type { RequestGame } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

interface RequestGamesPopoverProps {
  games: RequestGame[];
}

export function RequestGamesPopover({ games }: RequestGamesPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button variant="ghost" colorPalette="primary" size="sm" className="-ml-150 underline" />
        }
      >
        구인 {games.length}건
      </Popover.Trigger>
      <Popover.Popup align="start" className="w-[300px] p-075">
        <Text typography="body4" weight="bold" foreground="muted" className="px-100 pb-050">
          이 이름을 적은 구인
        </Text>
        <VStack>
          {games.map((game) => (
            <Button
              key={game.id}
              variant="ghost"
              size="sm"
              render={<ServerLink path={`/posts/${game.id}`} />}
              className="justify-between gap-150"
            >
              <span className="truncate">{game.title}</span>
              <Text typography="body4" foreground="hint" className="shrink-0">
                {game.gmNickname}
              </Text>
            </Button>
          ))}
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
