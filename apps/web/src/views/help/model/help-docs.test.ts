import { isNumber, isPlainObject, isString } from "es-toolkit";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { HELP_CATEGORY, HELP_DOCS } from "./help-docs";

function collectText(node: unknown): string {
  if (isString(node) || isNumber(node)) return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node)) return collectText(node.props.children);
  if (isPlainObject(node)) return Object.values(node).map(collectText).join(" ");
  return "";
}

const BANNED = [
  "노쇼",
  "자동 추첨",
  "자동으로 뽑",
  "모집 스레드",
  "게임명",
  "DM으로",
  "누르세요",
  "하세요",
  "3개월",
  '추첨하기"를 누릅니다',
];

describe("HELP_DOCS", () => {
  it("12편이 목록 순서와 분류대로 있고 slug가 겹치지 않는다", () => {
    expect(HELP_DOCS.map((doc) => [doc.slug, doc.category])).toEqual([
      ["find-and-join", HELP_CATEGORY.join],
      ["recruit-methods", HELP_CATEGORY.join],
      ["schedule-grid", HELP_CATEGORY.join],
      ["cancel-participation", HELP_CATEGORY.join],
      ["after-session", HELP_CATEGORY.join],
      ["rulebook-cert", HELP_CATEGORY.host],
      ["create-game", HELP_CATEGORY.host],
      ["manage-roster", HELP_CATEGORY.host],
      ["notifications", HELP_CATEGORY.account],
      ["profile-links", HELP_CATEGORY.account],
      ["status-glossary", HELP_CATEGORY.account],
      ["monthly-score", HELP_CATEGORY.account],
    ]);
    expect(HELP_CATEGORY.account).toBe("계정과 알림");
  });

  it("이어 읽기는 있는 문서만 가리킨다", () => {
    const slugs = new Set(HELP_DOCS.map((doc) => doc.slug));
    for (const doc of HELP_DOCS) {
      for (const related of doc.related) expect(slugs.has(related)).toBe(true);
    }
  });

  it("낡은 말과 명령형 안내가 없다", () => {
    const text = collectText(HELP_DOCS);
    expect(text).toContain("신청자가 있으면 모집·일정 방식은 바꿀 수 없습니다.");
    for (const word of BANNED) expect(text).not.toContain(word);
    expect(text).not.toContain("—");
  });
});
