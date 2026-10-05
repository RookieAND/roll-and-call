import { Callout, Text, VStack } from "@roll-and-call/ui";

import { clockParticle, formatDateTime } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

import {
  ATTENDANCE_GUIDE,
  type AttendanceGuide as AttendanceGuideKind,
} from "../model/attendance-guide-kind";

const ASK_STAFF = "고쳐야 할 기록이 있으면 운영진에게 문의해 주세요.";

const LOCKED_LINES = {
  [ATTENDANCE_GUIDE.autoConfirmed]: `세션이 끝나고 24시간이 지나 출석이 자동으로 확정되었습니다.`,
  [ATTENDANCE_GUIDE.closed]: "출석을 고칠 수 있는 기간이 지났습니다.",
  [ATTENDANCE_GUIDE.frozen]: `세션이 끝나고 24시간이 지나 직전에 확정한 대로 굳었습니다.`,
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
    const autoLines = [`${deadlineText}까지 확인하지 않으면 자동으로 확정됩니다.`];
    if (hasRemoved) {
      autoLines.push("이때 불참으로 내보낸 사람은 불참으로 남고, 나머지는 참석으로 처리됩니다.");
    }
    return (
      <VStack gap="100">
        <Callout.Root colorPalette="primary">
          <Callout.Icon />
          <Callout.Description className="break-keep">
            기본값은 전원 참석입니다.
            <br />
            오지 않은 사람만 <b>불참</b>으로 바꿔 주세요.
          </Callout.Description>
        </Callout.Root>
        <Text typography="body4" foreground="hint" render={<p />} className="break-keep">
          <LineBreaks lines={autoLines} />
        </Text>
      </VStack>
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
        <Callout.Description className="break-keep">
          {formatDateTime(attendanceConfirmedAt)}에 출석을 확정했습니다.
          <br />
          다시 고치기를 누르면 참석·불참을 다시 정할 수 있습니다.
        </Callout.Description>
      </Callout.Root>
    );
  }
  if (kind === ATTENDANCE_GUIDE.confirmed) return null;
  return (
    <Callout.Root colorPalette="gray">
      <Callout.Description className="break-keep">
        <LineBreaks lines={[LOCKED_LINES[kind], ASK_STAFF]} />
      </Callout.Description>
    </Callout.Root>
  );
}
