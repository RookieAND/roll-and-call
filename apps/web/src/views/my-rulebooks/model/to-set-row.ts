import {
  CERT_OPTION,
  certApplyHref,
  certOption,
  rejectionSummary,
  SET_STATUS,
  setStatus,
  type EditionSet,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import { isFresh } from "./is-fresh";
import type { ListRow } from "./list-row";

const detailHref = (rulebook: MyRulebook) => `/me/rulebooks/${rulebook.id}`;

// 판본 하나의 GM 자격 한 줄. 기록이 없거나 무료 배포로만 열린 판본은 null.
export function toSetRow(set: EditionSet, rulebooks: MyRulebook[], now: Date): ListRow | null {
  const { status, book, missing } = setStatus(set);
  const certifiedCount = set.cores.length - missing.length;
  const progress = `기본 룰북 ${certifiedCount}/${set.cores.length} 인증`;
  const base = { key: set.key, title: set.label };
  switch (status) {
    case SET_STATUS.ready: {
      if (!set.earned) return null;
      const certified = set.cores.find((core) => core.certRequired) ?? set.cores[0]!;
      const sub = set.covers.length
        ? `${set.covers.join("·")} 구인도 열 수 있습니다`
        : set.unlockedBy
          ? `${set.unlockedBy} 인증으로 열립니다`
          : `${toKst(certified.stateAt ?? now).format("YYYY.MM.DD")} 인증`;
      return {
        ...base,
        icon: "check",
        tone: "success",
        sub,
        badge: { label: "GM 가능", palette: "success" },
        href: detailHref(certified.unlockedBy ?? certified),
      };
    }
    case SET_STATUS.rejected:
      return {
        ...base,
        icon: "alert",
        tone: "warning",
        sub: `반려 · ${rejectionSummary(book!.latestApplication)}`,
        subTone: "warning",
        badge: { label: "다시 신청 필요", palette: "warning" },
        fresh: isFresh(book!.stateAt, now),
        href: detailHref(book!),
      };
    case SET_STATUS.pending: {
      const applied = `${toKst(book!.stateAt!).format("MM.DD")} 신청`;
      return {
        ...base,
        icon: "clock",
        tone: "gray",
        sub: certifiedCount > 0 ? `${progress} · ${applied}` : applied,
        badge: { label: "심사 중", palette: "gray" },
        href: detailHref(book!),
      };
    }
    case SET_STATUS.partial: {
      const applicable = missing.filter(
        (core) => certOption(core, rulebooks).type === CERT_OPTION.pick,
      );
      return {
        ...base,
        icon: "book",
        tone: "primary",
        sub: progress,
        badge: { label: `${missing.length}권 남음`, palette: "primary" },
        href: certApplyHref(applicable.map((core) => core.id)),
      };
    }
    case SET_STATUS.revoked:
      return {
        ...base,
        icon: "alert",
        tone: "danger",
        sub: book!.revokeReason ? `취소 · ${book!.revokeReason}` : "운영진이 인증을 취소했습니다",
        subTone: "warning",
        badge: { label: "인증 취소됨", palette: "danger" },
        fresh: isFresh(book!.stateAt, now),
        href: detailHref(book!),
      };
    default:
      return null;
  }
}
