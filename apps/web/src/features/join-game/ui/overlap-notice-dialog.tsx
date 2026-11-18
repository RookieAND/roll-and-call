"use client";

import { Button, Card, Dialog, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

import { OVERLAP_CLOSING_LINE, overlapNotice } from "../model/overlap-notice";
import type { OverlapDetail } from "../model/overlap-rejection";

interface OverlapNoticeDialogProps {
  overlap: OverlapDetail | null;
  onClose: () => void;
}

export function OverlapNoticeDialog({ overlap, onClose }: OverlapNoticeDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const notice = overlap && overlapNotice(overlap);
  const hasLines = !!notice && notice.lines.length > 0;
  const descriptionLines = hasLines ? [notice.intro] : [notice?.intro ?? "", OVERLAP_CLOSING_LINE];

  return (
    <Dialog.Root open={!isNull(overlap)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>세션을 신청할 수 없습니다</Dialog.Title>
          <Dialog.Description>
            <LineBreaks lines={descriptionLines} />
          </Dialog.Description>
        </Dialog.Header>
        {hasLines && (
          <>
            <Card.Root padding="md" radius={400} background="subtle">
              <VStack gap="050">
                {notice.lines.map((line) => (
                  <Text key={line} typography="body3" className="break-keep">
                    {line}
                  </Text>
                ))}
                {notice.moreLabel && (
                  <Text typography="body4" foreground="hint">
                    {notice.moreLabel}
                  </Text>
                )}
              </VStack>
            </Card.Root>
            <Text typography="body3" foreground="muted">
              {OVERLAP_CLOSING_LINE}
            </Text>
          </>
        )}
        <Dialog.Footer layout="row">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            닫기
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => router.push(toServerPath(`/games/${overlap?.overlapGameId}`))}
          >
            겹치는 세션 보기
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
