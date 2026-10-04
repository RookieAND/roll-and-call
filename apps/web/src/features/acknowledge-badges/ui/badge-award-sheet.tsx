"use client";

import { Button, HStack, Sheet } from "@roll-and-call/ui";
import { useState } from "react";

import { ServerLink, useAction } from "@/shared/ui";

import { acknowledgeBadges } from "../api/acknowledge-badges";
import { AWARD_SHEET_KIND, type AwardSheet } from "../model/award-sheet";
import { AwardHighlights } from "./award-highlights";
import { AwardRetro } from "./award-retro";

interface BadgeAwardSheetProps {
  sheet: AwardSheet;
}

// 어떻게 닫든(닫기·딤·이동) 보여 준 뱃지를 알린 것으로 적는다.
export function BadgeAwardSheet({ sheet }: BadgeAwardSheetProps) {
  const [open, setOpen] = useState(true);
  const { run } = useAction();
  const retro = sheet.kind === AWARD_SHEET_KIND.retro;
  const keys = retro
    ? sheet.items.map((item) => item.key)
    : [...sheet.highlights, ...sheet.chips].map((item) => item.key);

  function close() {
    setOpen(false);
    run(() => acknowledgeBadges(keys));
  }

  const dismissLabel = retro ? "나중에" : "닫기";
  const primaryPath = retro ? "/me/badges/featured" : "/me/badges";
  const primaryLabel = retro ? "대표 뱃지 고르기" : "업적 도감 보기";

  return (
    <Sheet.Root open={open} onOpenChange={(next) => !next && close()}>
      <Sheet.Popup aria-label="새 업적">
        {/* 메달 뒤 빛살이 시트 가장자리까지 번지도록 Body를 패딩 밖으로 넓힌다. */}
        <Sheet.Body className="-mx-250 -mt-250 px-250 pt-250 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Sheet.Handle />
          {sheet.kind === AWARD_SHEET_KIND.retro ? (
            <AwardRetro sheet={sheet} />
          ) : (
            <AwardHighlights sheet={sheet} onNavigate={close} />
          )}
        </Sheet.Body>
        <Sheet.Footer className="pt-250">
          <HStack gap="100">
            <Button variant="outline" size="lg" className="flex-1" onClick={close}>
              {dismissLabel}
            </Button>
            <Button
              render={<ServerLink path={primaryPath} onClick={close} />}
              size="lg"
              className="flex-1"
            >
              {primaryLabel}
            </Button>
          </HStack>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
