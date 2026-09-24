"use client";

import { Button, Sheet, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { CERT_REVIEW_TIME, CERT_STATE, CertStateRow } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

export interface PendingCertification {
  rulebookId: string;
  label: string;
  appliedAt: Date;
}

interface NewGameGateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: PendingCertification | null;
}

// 적용일이 지났는데 인증된 룰북이 없을 때. 버튼 문구가 길어 위아래로 쌓고, 위가 주 행동이다.
export function NewGameGateSheet({ open, onOpenChange, pending }: NewGameGateSheetProps) {
  const title = pending
    ? "룰북 확인이 끝나면 구인을 열 수 있습니다."
    : "구인을 열려면 룰북 인증이 필요합니다.";
  const primaryHref = pending ? `/me/rulebooks/${pending.rulebookId}` : "/me/rulebooks/apply";
  const primaryVariant = pending ? "tinted" : "solid";
  const primaryLabel = pending ? "신청 내용 보기" : "룰북 인증하기";

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label={title}>
        <Sheet.Handle />
        <Sheet.Body>
          <VStack gap="175">
            <VStack gap="075">
              <Text typography="heading2" render={<h2 />} className="[text-wrap:pretty]">
                {title}
              </Text>
              <Text
                typography="body3"
                foreground="muted"
                render={<p />}
                className="[text-wrap:pretty]"
              >
                {pending ? (
                  "결과는 마이페이지의 인증한 룰북에서 볼 수 있습니다."
                ) : (
                  <>
                    가지고 있는 실물 룰북 사진 3장으로 인증합니다.
                    <br />
                    무료 배포 룰은 인증 없이 열 수 있습니다.
                  </>
                )}
              </Text>
            </VStack>
            {pending && (
              <div className="overflow-hidden rounded-500 border border-gray-200">
                <CertStateRow
                  state={CERT_STATE.pending}
                  title={pending.label}
                  meta={`${toKst(pending.appliedAt).format("MM.DD")} 신청 · ${CERT_REVIEW_TIME}`}
                  statusPlacement="inline"
                  chevron={false}
                />
              </div>
            )}
            <VStack gap="100" className="mt-050">
              <Button
                render={<Link href={primaryHref} />}
                variant={primaryVariant}
                size="lg"
                className="w-full"
              >
                {primaryLabel}
              </Button>
              <Button
                render={<Link href="/games/new" />}
                variant="outline"
                size="lg"
                className="w-full"
              >
                인증 없이 열 수 있는 룰로 열기
              </Button>
            </VStack>
          </VStack>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
