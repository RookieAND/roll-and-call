import { formatDate } from "@/shared/lib";

export function suspensionNotice({
  suspended,
  suspendedUntil,
}: {
  suspended: boolean;
  suspendedUntil: Date | null;
}) {
  if (!suspended) return null;
  if (suspendedUntil) return `활동 정지는 ${formatDate(suspendedUntil)}에 해제됩니다.`;
  return "정지가 풀리면 다시 신청할 수 있습니다.";
}
