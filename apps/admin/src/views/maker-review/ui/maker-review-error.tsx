"use client";

import { Grid, VStack } from "@roll-and-call/ui";

import { ApproveCard, RejectCard } from "@/features/decide-homebrew";
import { AdminHeader, NextItemButton } from "@/shared/ui";

import { ReviewFailCallout } from "./review-fail-callout";

interface MakerReviewErrorProps {
  retry: () => void;
}

// 신청 이름을 모르므로 경로는 「룰북 인증 › 자작 룰」까지만 보이고, [다음 건]도 끈다.
export function MakerReviewError({ retry }: MakerReviewErrorProps) {
  return (
    <>
      <AdminHeader
        title="자작 룰"
        trail={[{ href: "/cert", label: "룰북 인증" }]}
        actions={<NextItemButton />}
      />
      <Grid className="w-full flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <ReviewFailCallout retry={retry} />
        <VStack gap="150">
          <ApproveCard disabled />
          <RejectCard disabled />
        </VStack>
      </Grid>
    </>
  );
}
