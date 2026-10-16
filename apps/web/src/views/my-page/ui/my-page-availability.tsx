import { AvailabilityRows, type AvailabilityInterval } from "@/entities/profile";

import { MyPageBlockLabel } from "./my-page-block-label";

interface MyPageAvailabilityProps {
  availability: AvailabilityInterval[];
}

export function MyPageAvailability({ availability }: MyPageAvailabilityProps) {
  const filled = availability.length > 0;
  return (
    <div>
      <MyPageBlockLabel
        label="가능 시간대"
        action={{ path: "/me/availability?from=me", label: filled ? "편집" : "추가" }}
      />
      <AvailabilityRows
        intervals={availability}
        note={
          filled
            ? "일정 조율 화면을 열면 이 시간대가 미리 칠해져 있습니다."
            : "적어두면 일정 조율 화면에 미리 칠해져 있습니다."
        }
      />
    </div>
  );
}
