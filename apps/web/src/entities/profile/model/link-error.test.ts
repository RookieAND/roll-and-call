import { describe, expect, it } from "vitest";

import { linkError } from "./link-error";

const ok = (service: string, value: string) => expect(linkError({ service, value })).toBeNull();
const bad = (service: string, value: string) =>
  expect(linkError({ service, value })).toEqual(expect.any(String));

describe("linkError", () => {
  it("빈 값과 검사하지 않는 서비스는 통과한다", () => {
    ok("notion", "");
    ok("x", "아무거나");
    ok("link", "아무거나");
  });
  it("유튜브는 핸들이나 유튜브 주소만 받는다", () => {
    ok("youtube", "@rookie");
    ok("youtube", "https://youtube.com/@rookie");
    ok("youtube", "youtu.be/abc123");
    bad("youtube", "https://example.com/@rookie");
    bad("youtube", "youtube.com");
  });
  it("스프레드시트는 구글 시트 주소만 받는다", () => {
    ok("sheets", "docs.google.com/spreadsheets/d/abc/edit");
    bad("sheets", "docs.google.com/document/d/abc");
    bad("sheets", "https://example.com/spreadsheets/d/abc");
  });
  it("드라이브와 노션은 해당 도메인의 경로 있는 주소만 받는다", () => {
    ok("drive", "https://drive.google.com/file/d/abc/view");
    bad("drive", "https://drive.google.com");
    ok("notion", "https://www.notion.so/page-123");
    ok("notion", "myteam.notion.site/page");
    bad("notion", "https://example.com/page");
  });
});
