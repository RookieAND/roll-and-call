import { isOwnCertFile } from "@/entities/rulebook";

import { HOMEBREW_ERROR } from "./homebrew-error";
import { HOMEBREW_FIELD } from "./homebrew-field";
import type { HomebrewInput } from "./homebrew-input-schema";
import { isWebLink } from "./is-web-link";

// 빈 링크 칸은 화면이 빼고 보낸다. 이미지는 내 경로에 올린 인증 버킷 파일만 받는다.
export function homebrewInputError({
  input,
  serverId,
  userId,
}: {
  input: HomebrewInput;
  serverId: string;
  userId: string;
}): { error: string; field: string } | null {
  if (!input.name.trim()) return { error: HOMEBREW_ERROR.nameRequired, field: HOMEBREW_FIELD.name };
  if (!input.summary.trim()) {
    return { error: HOMEBREW_ERROR.summaryRequired, field: HOMEBREW_FIELD.summary };
  }
  if (!input.links.every(isWebLink)) {
    return { error: HOMEBREW_ERROR.linkFormat, field: HOMEBREW_FIELD.links };
  }
  if (new Set(input.links).size !== input.links.length) {
    return { error: HOMEBREW_ERROR.linkDuplicate, field: HOMEBREW_FIELD.links };
  }
  if (!input.imageUrls.every((url) => isOwnCertFile({ url, serverId, userId }))) {
    return { error: HOMEBREW_ERROR.imageInvalid, field: HOMEBREW_FIELD.images };
  }
  if (input.links.length + input.imageUrls.length === 0) {
    return { error: HOMEBREW_ERROR.materialRequired, field: HOMEBREW_FIELD.material };
  }
  return null;
}
