import { ActionNotice } from "./action-notice";

export function AbsentActions() {
  return (
    <ActionNotice
      title="이 세션에 불참으로 기록되었습니다"
      lines={["이의가 있으면 운영진에게 문의해 주세요."]}
    />
  );
}
