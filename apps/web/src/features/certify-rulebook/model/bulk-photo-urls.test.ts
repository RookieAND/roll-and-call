import { BULK_CERT_MAX_PHOTOS } from "@roll-and-call/database/certifications/model";
import { describe, expect, it } from "vitest";

import { CERT_BULK_PHOTO_KEYS } from "@/entities/rulebook";

import { bulkPhotoUrls } from "./bulk-photo-urls";

describe("bulkPhotoUrls", () => {
  it("사진을 앞면·뒷면 칸부터 순서대로 담는다", () => {
    expect(bulkPhotoUrls(["a", "b"])).toEqual({ front: "a", back: "b" });
  });

  it("세 장째부터는 추가 증빙 칸에 담는다", () => {
    expect(bulkPhotoUrls(["a", "b", "c", "d", "e"])).toEqual({
      front: "a",
      back: "b",
      extra1: "c",
      extra2: "d",
      extra3: "e",
    });
  });

  it("한 장이면 앞면 칸만 채운다", () => {
    expect(bulkPhotoUrls(["a"])).toEqual({ front: "a" });
  });

  it("칸 수가 사진 한도와 같다", () => {
    expect(CERT_BULK_PHOTO_KEYS).toHaveLength(BULK_CERT_MAX_PHOTOS);
  });
});
