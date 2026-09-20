import { formatDate } from "@/shared/lib";

import { ActionHint } from "./action-hint";

interface RecruitEndedHintProps {
  endDate: Date;
}

// 기한이 지난 건 막다른 길이라 카드로 세우지 않고 버튼 위에 한 줄만 써붙인다.
export function RecruitEndedHint({ endDate }: RecruitEndedHintProps) {
  return <ActionHint>{formatDate(endDate)}에 모집이 끝났습니다.</ActionHint>;
}
