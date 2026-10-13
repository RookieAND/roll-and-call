import { describe, expect, it } from "vitest";

import { detectLinkProvider } from "./detect-link-provider";
import { LINK_PROVIDER } from "./link-provider";

describe("detectLinkProvider", () => {
  it("디스코드 채널 링크를 알아본다", () => {
    expect(detectLinkProvider("https://discord.com/channels/1/2")).toBe(LINK_PROVIDER.discord);
  });

  it("구글 스프레드시트와 문서를 알아보고 드라이브는 건너뛴다", () => {
    expect(detectLinkProvider("https://docs.google.com/spreadsheets/d/abc/edit")).toBe(
      LINK_PROVIDER.sheets,
    );
    expect(detectLinkProvider("https://docs.google.com/document/u/0/d/abc/mobilebasic")).toBe(
      LINK_PROVIDER.docs,
    );
    expect(detectLinkProvider("https://docs.google.com/presentation/d/abc/edit")).toBe(
      LINK_PROVIDER.slides,
    );
    expect(detectLinkProvider("https://docs.google.com/forms/d/e/abc/viewform")).toBe(
      LINK_PROVIDER.forms,
    );
    expect(detectLinkProvider("https://forms.gle/abc123")).toBe(LINK_PROVIDER.forms);
    expect(detectLinkProvider("https://drive.google.com/file/d/abc/view")).toBe(
      LINK_PROVIDER.drive,
    );
    expect(detectLinkProvider("https://docs.google.com/drawings/d/abc")).toBeUndefined();
  });

  it("노션 주소와 하위 도메인을 알아본다", () => {
    expect(detectLinkProvider("https://www.notion.so/page-123")).toBe(LINK_PROVIDER.notion);
    expect(detectLinkProvider("https://notion.so/team/page-123")).toBe(LINK_PROVIDER.notion);
    expect(detectLinkProvider("https://my-team.notion.site/page-123")).toBe(LINK_PROVIDER.notion);
  });

  it("포스타입과 TRPG Diary 주소와 하위 도메인을 알아본다", () => {
    expect(detectLinkProvider("https://www.postype.com/@writer/post/123")).toBe(
      LINK_PROVIDER.postype,
    );
    expect(detectLinkProvider("https://my-blog.postype.com/post/123")).toBe(LINK_PROVIDER.postype);
    expect(detectLinkProvider("https://trpg-diary.co.kr/scenario/1")).toBe(LINK_PROVIDER.trpgDiary);
    expect(detectLinkProvider("https://postype.com.evil.com/")).toBeUndefined();
  });

  it("호스트 이름에 도메인만 들어 있는 주소는 버린다", () => {
    expect(detectLinkProvider("https://notion.so.evil.com/page")).toBeUndefined();
    expect(detectLinkProvider("https://evil.com/notion.so")).toBeUndefined();
    expect(detectLinkProvider("https://notnotion.so/page")).toBeUndefined();
  });

  it("그 밖의 주소와 http(s) 아닌 주소는 버린다", () => {
    expect(detectLinkProvider("https://example.com")).toBeUndefined();
    expect(detectLinkProvider("ftp://notion.so/page")).toBeUndefined();
    expect(detectLinkProvider("javascript:alert(1)")).toBeUndefined();
  });
});
