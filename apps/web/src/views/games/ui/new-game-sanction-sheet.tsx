"use client";

import { Button, Card, Sheet, Text, VStack } from "@roll-and-call/ui";

import { sanctionLines } from "@/entities/sanction";

import type { NewGameSanction } from "../model/new-game-sanction";

interface NewGameSanctionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sanction: NewGameSanction;
}

export function NewGameSanctionSheet({ open, onOpenChange, sanction }: NewGameSanctionSheetProps) {
  const [reasonLine, periodLine] = sanctionLines(sanction);
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="text-heading3">지금은 구인을 열 수 없습니다</Sheet.Title>
        <Sheet.Body>
          <Card.Root background="subtle" radius={500} padding="sm">
            <VStack gap="075">
              <Text typography="body2" render={<p />} className="text-pretty">
                {reasonLine}
              </Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                {periodLine}
              </Text>
            </VStack>
          </Card.Root>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close render={<Button size="lg" className="w-full" />}>확인</Sheet.Close>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
