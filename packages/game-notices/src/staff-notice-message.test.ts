import { afterEach, describe, expect, it, vi } from "vitest";

import { STAFF_NOTICE_KIND, type StaffNotice } from "./staff-notice-kind";
import { staffNoticeMessage } from "./staff-notice-message";

const message = (notice: StaffNotice) => staffNoticeMessage({ notice, slug: "trpia" });
const embedOf = (notice: StaffNotice) => message(notice).embeds?.[0];

describe("staffNoticeMessage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("인증 신청: 제목, 신청자 · 룰북, 심사 상세 링크", () => {
    vi.stubEnv("ADMIN_APP_URL", "https://admin.example.app/");
    const result = message({
      kind: STAFF_NOTICE_KIND.certApplied,
      applicantNickname: "김코코",
      rulebookLabel: "크툴루의 부름 7판",
      applicationId: "app-1",
    });
    expect(result.embeds?.[0]).toMatchObject({
      title: "새 룰북 인증 신청이 들어왔습니다",
      description: "김코코 · 크툴루의 부름 7판",
    });
    expect(result.buttons).toEqual([
      { label: "어드민에서 열기", url: "https://admin.example.app/trpia/cert/app-1" },
    ]);
    expect(result).not.toHaveProperty("content");
    expect(result).not.toHaveProperty("userMentions");
  });

  it("추가 요청: 판본이 없으면 이름만 쓴다", () => {
    const base = { kind: STAFF_NOTICE_KIND.rulebookRequested, requesterNickname: "달빛토끼" };
    expect(embedOf({ ...base, name: "던전 월드", edition: "2판" })).toMatchObject({
      title: "새 룰북 추가 요청이 들어왔습니다",
      description: "달빛토끼 · 던전 월드 2판",
    });
    expect(embedOf({ ...base, name: "던전 월드", edition: null })?.description).toBe(
      "달빛토끼 · 던전 월드",
    );
  });

  it("활동 정지: 기한까지, 기한이 없으면 해제될 때까지", () => {
    const base = {
      kind: STAFF_NOTICE_KIND.sanctioned,
      staffNickname: "새벽세시",
      targetUserId: "user-1",
      targetNickname: "탐정놀이중",
    };
    expect(embedOf({ ...base, until: new Date("2026-10-22T03:00:00Z") })).toMatchObject({
      title: "새벽세시님이 활동 정지를 확정했습니다",
      description: "탐정놀이중 · 2026년 10월 22일까지",
    });
    expect(embedOf({ ...base, until: null })?.description).toBe("탐정놀이중 · 해제될 때까지");
  });

  it("반려로 돌리기: 취소된 구인이 있으면 개수를 붙인다", () => {
    const base = {
      kind: STAFF_NOTICE_KIND.certRevoked,
      staffNickname: "새벽세시",
      targetUserId: "user-1",
      targetNickname: "김코코",
      rulebookLabel: "크툴루의 부름 7판",
    };
    expect(embedOf({ ...base, cancelledGameCount: 2 })).toMatchObject({
      title: "새벽세시님이 인증을 반려로 돌렸습니다",
      description: "김코코 · 크툴루의 부름 7판 · 취소된 구인 2개",
    });
    expect(embedOf({ ...base, cancelledGameCount: 0 })?.description).toBe(
      "김코코 · 크툴루의 부름 7판",
    );
  });

  it("인증 부여: 4명까지는 모두, 5명이면 앞 3명 외 2명", () => {
    const base = {
      kind: STAFF_NOTICE_KIND.certGranted,
      staffNickname: "새벽세시",
      rulebookId: "book-1",
      rulebookLabel: "D&D 5판",
    };
    expect(embedOf({ ...base, nicknames: ["가", "나", "다", "라"] })?.description).toBe(
      "D&D 5판 · 가, 나, 다, 라",
    );
    expect(embedOf({ ...base, nicknames: ["가", "나", "다", "라", "마"] })).toMatchObject({
      title: "새벽세시님이 인증을 부여했습니다",
      description: "D&D 5판 · 가, 나, 다 외 2명",
    });
  });

  it("ADMIN_APP_URL이 없으면 버튼이 없다", () => {
    vi.stubEnv("ADMIN_APP_URL", "");
    const result = message({
      kind: STAFF_NOTICE_KIND.certGranted,
      staffNickname: "새벽세시",
      rulebookId: "book-1",
      rulebookLabel: "D&D 5판",
      nicknames: ["가"],
    });
    expect(result.buttons).toEqual([]);
  });
});
