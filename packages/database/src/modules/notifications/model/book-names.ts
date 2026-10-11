interface BookNamesParams {
  rulebookName: string;
  otherCount?: number;
}

// 묶음으로 처리했으면 「첫 책 외 N권」, 한 권이면 책 이름 그대로.
export function bookNames({ rulebookName, otherCount }: BookNamesParams) {
  return (otherCount ?? 0) > 0 ? `${rulebookName} 외 ${otherCount}권` : rulebookName;
}
