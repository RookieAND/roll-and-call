// 전원 참석이면 이 확인 자체가 뜨지 않는다(AttendanceForm이 바로 확정한다).
export function confirmDescription(absentNames: string[]) {
  const names = absentNames.join(", ");

  return {
    names,
    warningLines: [
      `${names}님 프로필에 30일 동안 보입니다.`,
      "이 달의 기록에는 들어가지 않습니다.",
    ],
    notice: `${names}님에게 알림이 갑니다.`,
  };
}
