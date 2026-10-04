// 추방 카드를 막는 이유. 막지 않으면 null이다. 서버 액션도 같은 조건으로 막는다.
export function kickBlockReason({
  serverOwner,
  staff,
  self,
}: {
  serverOwner: boolean;
  staff: boolean;
  self: boolean;
}) {
  if (serverOwner) return "서버 소유자는 추방할 수 없습니다";
  if (staff || self) return "운영진은 추방할 수 없습니다";
  return null;
}
