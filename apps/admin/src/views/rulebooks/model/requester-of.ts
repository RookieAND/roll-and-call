import type { RulebookRequestRow } from "@/entities/rulebook/server";

export const requesterOf = (request: RulebookRequestRow) =>
  request.otherRequesterCount > 0
    ? `${request.requesterNickname} 외 ${request.otherRequesterCount}명`
    : request.requesterNickname;
