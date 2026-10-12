import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";

// 신청글이 비었는지 길이를 넘었는지 나누어 알린다. 웹은 같은 사유를 한 문장으로 알린다.
export function discordNoteMessage(note: string | undefined): string {
  const length = note?.trim().length ?? 0;
  if (length === 0) return "신청글이 비어 있습니다.\n내용을 적어 다시 신청해 주세요.";
  return `신청글이 ${APPLICATION_NOTE_MAX_LENGTH}자를 넘었습니다.\n지금은 ${length}자이니 줄여서 다시 신청해 주세요.`;
}
