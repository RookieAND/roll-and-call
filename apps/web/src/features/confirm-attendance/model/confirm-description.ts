// 전원 참석이면 이 확인 자체가 뜨지 않는다(AttendanceForm이 바로 확정한다).
export function confirmDescription(absentNames: string[]) {
  const names = absentNames.join(", ");

  return {
    headline: `${names}님이 불참으로 기록됩니다.`,
    lines: [
      `불참 기록이 ${names}님의 프로필에 세션 날짜부터 30일 동안 남습니다.`,
      `이 세션은 ${names}님의 참여한 세션 수와 이 달의 기록에 들어가지 않습니다.`,
      `${names}님에게 알림 탭으로 알립니다.`,
    ],
  };
}
