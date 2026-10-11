interface GroupDoneMessageInput {
  approveCount: number;
  rejectCount: number;
  nickname: string;
}

export function groupDoneMessage({ approveCount, rejectCount, nickname }: GroupDoneMessageInput) {
  if (rejectCount === 0) return `${approveCount}권을 승인했습니다 · ${nickname}`;
  if (approveCount === 0) return `${rejectCount}권을 반려했습니다 · ${nickname}`;
  return `${approveCount}권 승인, ${rejectCount}권 반려했습니다 · ${nickname}`;
}
