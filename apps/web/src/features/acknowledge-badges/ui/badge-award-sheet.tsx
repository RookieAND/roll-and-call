"use client";

import { Button, HStack, Sheet } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { acknowledgeBadges } from "../api/acknowledge-badges";
import { pinFeaturedBadge } from "../api/pin-featured-badge";
import type { AwardSheet } from "../model/award-sheet";
import { AwardMulti } from "./award-multi";
import { AwardRetro } from "./award-retro";
import { AwardSingle } from "./award-single";

interface BadgeAwardSheetProps {
  sheet: AwardSheet;
}

// 홈에 들어오면 한 번 뜬다. 어떻게 닫든(닫기·딤·이동) 보여 준 뱃지를 알린 것으로 적는다.
export function BadgeAwardSheet({ sheet }: BadgeAwardSheetProps) {
  const [open, setOpen] = useState(true);
  const { run } = useAction();
  const keys = sheet.kind === "single" ? [sheet.item.key] : sheet.items.map((item) => item.key);

  function close() {
    setOpen(false);
    run(() => acknowledgeBadges(keys));
  }

  function pin() {
    if (sheet.kind !== "single") return;
    setOpen(false);
    run(() => pinFeaturedBadge(sheet.item.key), {
      onSuccess: () => toast.success("대표 뱃지로 걸었습니다"),
    });
  }

  const dismissLabel = sheet.kind === "retro" ? "나중에" : "닫기";
  const pinnable = sheet.kind === "single" && sheet.pinnable;
  const primaryHref = sheet.kind === "retro" ? "/me/badges/featured" : "/me/badges";
  const primaryLabel = sheet.kind === "retro" ? "대표 뱃지 고르기" : "업적 도감 보기";

  return (
    <Sheet.Root open={open} onOpenChange={(next) => !next && close()}>
      <Sheet.Popup aria-label="새 업적">
        {/* 메달 뒤 빛살이 시트 가장자리까지 번지도록 Body를 패딩 밖으로 넓힌다. */}
        <Sheet.Body className="-mx-250 -mt-250 px-250 pt-250 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Sheet.Handle />
          {sheet.kind === "single" && <AwardSingle sheet={sheet} onNavigate={close} />}
          {sheet.kind === "multi" && <AwardMulti sheet={sheet} />}
          {sheet.kind === "retro" && <AwardRetro sheet={sheet} />}
        </Sheet.Body>
        <Sheet.Footer className="pt-250">
          <HStack gap="100">
            <Button variant="outline" size="lg" className="flex-1" onClick={close}>
              {dismissLabel}
            </Button>
            {pinnable ? (
              <Button size="lg" className="flex-1" onClick={pin}>
                대표 뱃지로 걸기
              </Button>
            ) : (
              <Button
                render={<Link href={primaryHref} onClick={close} />}
                size="lg"
                className="flex-1"
              >
                {primaryLabel}
              </Button>
            )}
          </HStack>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
