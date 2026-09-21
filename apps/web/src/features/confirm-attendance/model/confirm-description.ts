// 불참은 사람에게 남는 기록이라 확정 전에 무엇이 남는지 그 자리에서 다 말한다.
// 전원 참석이면 이 확인 자체가 뜨지 않는다(AttendanceForm이 바로 확정한다).
export function confirmDescription(absentNames: string[]) {
  const names = absentNames.join(", ");

  return {
    headline: `${names}님이 불참으로 기록됩니다.`,
    detail: `불참 기록이 ${names}님의 프로필에 3개월 동안 남습니다.\n이 세션은 ${names}님의 완료 기록과 이 달의 기록에 들어가지 않습니다.`,
  };
}
