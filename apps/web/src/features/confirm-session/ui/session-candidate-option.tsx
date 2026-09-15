import { Text, cn } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";

import type { SessionCandidate } from "../model/session-candidate";

export function SessionCandidateOption({
  candidate,
  checked,
  isCurrent,
  confirmedCount,
  onSelect,
}: {
  candidate: SessionCandidate;
  checked: boolean;
  isCurrent: boolean;
  confirmedCount: number;
  onSelect: (iso: string) => void;
}) {
  const everyone = confirmedCount > 0 && candidate.count >= confirmedCount;
  const countLabel = everyone ? `${candidate.count}명 전원 가능` : `${candidate.count}명 가능`;
  const detail = isCurrent ? `지금 확정된 시간 · ${countLabel}` : countLabel;
  const detailForeground = everyone ? "success" : "muted";

  return (
    // ponytail: 네이티브 라디오를 행 전체 label로 감싼다. 선택 행 룩이 Chip과 달라 손코딩.
    <label
      className={cn(
        "flex min-h-13 cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2.5 last:border-b-0",
        checked && "bg-tinted-bg",
        isCurrent && "cursor-default",
      )}
    >
      <input
        type="radio"
        name="confirm-slot"
        value={candidate.iso}
        checked={checked}
        disabled={isCurrent}
        onChange={() => onSelect(candidate.iso)}
        className="size-4 accent-primary-600"
      />
      <span className="min-w-0 flex-1">
        <Text typography="subtitle2" className="block">
          {formatDateTime(candidate.iso)}
        </Text>
        <Text typography="body4" foreground={detailForeground} className="block">
          {detail}
        </Text>
      </span>
    </label>
  );
}
