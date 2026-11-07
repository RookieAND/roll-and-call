"use client";

import { VStack } from "@roll-and-call/ui";

import { AdminHeader } from "@/shared/ui";

import { ReviewFailCallout } from "./review-fail-callout";

interface MakerReviewMobileErrorProps {
  retry: () => void;
}

export function MakerReviewMobileError({ retry }: MakerReviewMobileErrorProps) {
  return (
    <>
      <AdminHeader title="자작 룰" trail={[{ href: "/cert/maker", label: "자작 룰" }]} />
      <VStack className="px-150 pt-150">
        <ReviewFailCallout retry={retry} />
      </VStack>
    </>
  );
}
