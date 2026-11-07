"use client";

import { Button, Callout, VStack } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { CertRouteTabs } from "@/entities/cert";
import { AdminHeader } from "@/shared/ui";

interface MakerQueueMobileErrorProps {
  retry: () => void;
}

export function MakerQueueMobileError({ retry }: MakerQueueMobileErrorProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertRouteTabs value="/cert/maker" />
      <VStack className="p-150">
        <Callout.Root colorPalette="danger">
          <Callout.Icon />
          <Callout.Title>심사 대기열을 불러오지 못했습니다.</Callout.Title>
          <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
          <Callout.Action>
            <Button variant="outline" colorPalette="gray" size="sm" onClick={retry}>
              <RotateCcw size={14} aria-hidden />
              다시 시도
            </Button>
          </Callout.Action>
        </Callout.Root>
      </VStack>
    </>
  );
}
