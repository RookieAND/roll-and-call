import type { RejectReason } from "@/entities/cert";
import { OTHER_REASON } from "@/shared/lib";

// 자작 룰 반려 사유 칩. 이름은 사유 태그로 남고, 고르면 신청자에게 보일 문구를 미리 채운다(시안 66 mk_reject).
export const HOMEBREW_REJECT_REASONS: readonly RejectReason[] = [
  {
    name: "자료를 열 수 없음",
    message: "제출한 자료를 열 수 없습니다. 공유 설정을 확인한 뒤 다시 신청해 주세요.",
  },
  {
    name: "룰 내용이 부족함",
    message:
      "룰을 판단하기에 자료의 내용이 부족합니다. 룰의 진행 방식을 더 적어 다시 신청해 주세요.",
  },
  {
    name: "다른 룰을 그대로 옮긴 것으로 보임",
    message:
      "다른 룰의 내용을 그대로 옮긴 것으로 보입니다. 직접 만든 룰의 자료로 다시 신청해 주세요.",
  },
  {
    name: "이름이 부적절하거나 겹침",
    message: "룰 이름이 부적절하거나 다른 룰과 겹칩니다. 이름을 바꿔 다시 신청해 주세요.",
  },
  { name: OTHER_REASON, message: "" },
];
