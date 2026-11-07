import { describe, expect, it } from "vitest";

import { HOMEBREW_ERROR } from "./homebrew-error";
import { homebrewInputError } from "./homebrew-input-error";
import type { HomebrewInput } from "./homebrew-input-schema";

const image = "https://x.supabase.co/storage/v1/object/public/cert-photos/servers/s1/u1/a.jpg";
const base: HomebrewInput = {
  name: "달그림자 연대기",
  edition: "",
  summary: "폐허가 된 여관에서 시작하는 미스터리 룰입니다.",
  links: ["https://docs.google.com/document/d/1"],
  imageUrls: [],
  previousId: null,
};
const errorOf = (input: Partial<HomebrewInput>) =>
  homebrewInputError({ input: { ...base, ...input }, serverId: "s1", userId: "u1" })?.error;

describe("homebrewInputError", () => {
  it("이름·소개·링크 하나면 통과한다", () => {
    expect(errorOf({})).toBeUndefined();
    expect(errorOf({ links: [], imageUrls: [image] })).toBeUndefined();
  });

  it("필수 입력과 자료 하나 이상을 본다", () => {
    expect(errorOf({ name: "  " })).toBe(HOMEBREW_ERROR.nameRequired);
    expect(errorOf({ summary: "" })).toBe(HOMEBREW_ERROR.summaryRequired);
    expect(errorOf({ links: [] })).toBe(HOMEBREW_ERROR.materialRequired);
  });

  it("링크는 http·https만, 같은 링크는 한 번만 받는다", () => {
    expect(errorOf({ links: ["docs.google.com/document/d/9xK"] })).toBe(HOMEBREW_ERROR.linkFormat);
    expect(errorOf({ links: ["ftp://example.com/a"] })).toBe(HOMEBREW_ERROR.linkFormat);
    expect(errorOf({ links: ["http://a.com", "http://a.com"] })).toBe(HOMEBREW_ERROR.linkDuplicate);
  });

  it("남의 경로에 올린 이미지는 받지 않는다", () => {
    expect(errorOf({ imageUrls: [image.replace("/u1/", "/u2/")] })).toBe(
      HOMEBREW_ERROR.imageInvalid,
    );
  });
});
