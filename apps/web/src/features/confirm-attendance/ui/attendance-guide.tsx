import { Callout } from "@roll-and-call/ui";

import { clockParticle, formatDateTime } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

import {
  ATTENDANCE_GUIDE,
  type AttendanceGuide as AttendanceGuideKind,
} from "../model/attendance-guide-kind";

const ASK_STAFF = "고쳐야 할 기록이 있으면 운영진에게 문의해 주세요.";

const LOCKED_GUIDE = {
  [ATTENDANCE_GUIDE.autoConfirmed]: {
    title: "출석이 자동으로 확정되었습니다",
    lines: ["세션이 끝나고 24시간이 지났습니다.", ASK_STAFF],
  },
  [ATTENDANCE_GUIDE.closed]: {
    title: "출석을 고칠 수 있는 기간이 지났습니다",
    lines: [ASK_STAFF],
  },
  [ATTENDANCE_GUIDE.frozen]: {
    title: "출석을 고칠 수 있는 기간이 지났습니다",
    lines: ["직전에 확정한 결과로 굳었습니다.", ASK_STAFF],
  },
} as const;

interface AttendanceGuideProps {
  kind: AttendanceGuideKind;
  deadline: Date;
  attendanceConfirmedAt: Date | null;
  hasRemoved: boolean;
}

export function AttendanceGuide({
  kind,
  deadline,
  attendanceConfirmedAt,
  hasRemoved,
}: AttendanceGuideProps) {
  const deadlineText = formatDateTime(deadline);

  if (kind === ATTENDANCE_GUIDE.open) {
    const lines = hasRemoved
      ? ["내보낸 사람은 불참으로 남습니다.", "확인하지 않으면 나머지는 참석으로 자동 확정됩니다."]
      : [
          "오지 않은 사람만 불참으로 바꿔 주세요.",
          "확인하지 않으면 전원 참석으로 자동 확정됩니다.",
        ];
    return (
      <Callout.Root colorPalette="primary">
        <Callout.Icon />
        <Callout.Title>{deadlineText}까지 확인해 주세요</Callout.Title>
        <Callout.Description className="break-keep">
          <LineBreaks lines={lines} />
        </Callout.Description>
      </Callout.Root>
    );
  }
  if (kind === ATTENDANCE_GUIDE.reediting) {
    const particle = clockParticle({ clock: deadlineText, kind: "subject" });
    return (
      <Callout.Root colorPalette="primary">
        <Callout.Icon />
        <Callout.Title>다시 고치는 중입니다.</Callout.Title>
        <Callout.Description className="break-keep">
          <LineBreaks
            lines={[
              "다시 확정할 때까지 직전 결과가 그대로 남고,",
              `${deadlineText}${particle} 지나면 직전 결과로 굳습니다.`,
            ]}
          />
        </Callout.Description>
      </Callout.Root>
    );
  }
  if (kind === ATTENDANCE_GUIDE.confirmed && attendanceConfirmedAt) {
    return (
      <Callout.Root colorPalette="success">
        <Callout.Icon />
        <Callout.Title>{formatDateTime(attendanceConfirmedAt)}에 출석을 확정했습니다</Callout.Title>
        <Callout.Description className="break-keep">
          다시 고치기를 누르면 참석·불참을 다시 정할 수 있습니다.
        </Callout.Description>
      </Callout.Root>
    );
  }
  if (kind === ATTENDANCE_GUIDE.confirmed) return null;
  const locked = LOCKED_GUIDE[kind];
  return (
    <Callout.Root colorPalette="gray">
      <Callout.Icon />
      <Callout.Title>{locked.title}</Callout.Title>
      <Callout.Description className="break-keep">
        <LineBreaks lines={locked.lines} />
      </Callout.Description>
    </Callout.Root>
  );
}
