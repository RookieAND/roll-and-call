import { Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Check, CircleAlert } from "lucide-react";

import { CERT_SHOT_LABEL, type CertShot } from "@/entities/rulebook";

const frame = cva("relative aspect-[3/4] overflow-hidden rounded-500 bg-secondary-strong", {
  variants: { flagged: { true: "border-2 border-warning-600", false: "border border-gray-200" } },
});

const MARK_CLASS =
  "absolute top-075 right-075 flex size-6 items-center justify-center rounded-full";

interface SubmittedPhotoProps {
  shot: CertShot;
  url: string | undefined;
  // 반려된 신청에서만 칸마다 문제 없음·다시 올리기를 표시한다.
  verdict: "ok" | "flagged" | null;
}

export function SubmittedPhoto({ shot, url, verdict }: SubmittedPhotoProps) {
  const flagged = verdict === "flagged";
  const label = flagged ? `${CERT_SHOT_LABEL[shot]} · 다시 올리기` : CERT_SHOT_LABEL[shot];
  const labelForeground = flagged ? "warning" : "muted";
  return (
    <VStack gap="075" className="min-w-0 flex-1">
      <div className={frame({ flagged })}>
        {/* oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다. */}
        {url && (
          <img src={url} alt={`${CERT_SHOT_LABEL[shot]} 사진`} className="size-full object-cover" />
        )}
        {verdict === "ok" && (
          <span className={`${MARK_CLASS} bg-success-solid text-on-primary`}>
            <Check size={13} strokeWidth={3} aria-label="문제 없음" />
          </span>
        )}
        {flagged && (
          <span className={`${MARK_CLASS} bg-warning-600 text-surface`}>
            <CircleAlert size={13} strokeWidth={3} aria-label="다시 올리기" />
          </span>
        )}
      </div>
      <Text typography="body3" weight="bold" foreground={labelForeground} className="text-center">
        {label}
      </Text>
    </VStack>
  );
}
