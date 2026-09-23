import { Callout } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface AttendanceGuideProps {
  attendanceConfirmedAt: Date | null;
}

// 고르는 중에는 할 일을, 확정 뒤에는 언제 정했고 어떻게 되돌리는지를 말한다.
export function AttendanceGuide({ attendanceConfirmedAt }: AttendanceGuideProps) {
  if (attendanceConfirmedAt) {
    return (
      <Callout.Root colorPalette="success">
        <Callout.Icon />
        <Callout.Description>
          {formatDateTime(attendanceConfirmedAt)}에 출석을 확정했습니다.
          <br />
          아래 &lsquo;다시 고치기&rsquo;를 누르면 참석·불참을 다시 정할 수 있습니다.
        </Callout.Description>
      </Callout.Root>
    );
  }
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Icon />
      <Callout.Description>
        기본값은 전원 참석입니다.
        <br />
        오지 않은 사람만 <b>불참</b>으로 바꿔 주세요.
      </Callout.Description>
    </Callout.Root>
  );
}
