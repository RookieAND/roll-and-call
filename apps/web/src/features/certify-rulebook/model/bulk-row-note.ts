import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";

interface BulkRowNoteInput {
  limitBlocked: boolean;
  withCore: boolean;
  needsCoreLocked: boolean;
  fallback: string;
}

export function bulkRowNote({
  limitBlocked,
  withCore,
  needsCoreLocked,
  fallback,
}: BulkRowNoteInput) {
  if (limitBlocked) return `한 번에 최대 ${BULK_CERT_MAX_BOOKS}권까지 신청할 수 있습니다`;
  if (withCore) return "기본 룰북과 함께 신청합니다";
  if (needsCoreLocked) return "같은 판본의 기본 룰북을 선택해야 합니다";
  return fallback;
}
