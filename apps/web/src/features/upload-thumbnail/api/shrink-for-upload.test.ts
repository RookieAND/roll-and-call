import { describe, expect, it, vi } from "vitest";

import { IMAGE_TOO_LARGE_MESSAGE } from "../model/upload-rules";
import { shrinkForUpload } from "./shrink-for-upload";

const { shrinkImage, shrinkAnimatedImage } = vi.hoisted(() => ({
  shrinkImage: vi.fn(),
  shrinkAnimatedImage: vi.fn(),
}));
vi.mock("@/shared/api", () => ({ shrinkImage, shrinkAnimatedImage }));

const MB = 1024 * 1024;
const fileOf = (bytes: number, type = "image/jpeg") =>
  new File([new Uint8Array(bytes)], "photo", { type });

describe("shrinkForUpload", () => {
  it("12MB 원본도 줄인 결과가 10MB 이하면 올린다", async () => {
    const shrunk = fileOf(2 * MB);
    shrinkImage.mockResolvedValueOnce(shrunk);
    expect(await shrinkForUpload(fileOf(12 * MB))).toEqual({ file: shrunk });
  });

  it("줄여도 10MB를 넘으면 막는다", async () => {
    shrinkImage.mockResolvedValueOnce(fileOf(10 * MB + 1));
    expect(await shrinkForUpload(fileOf(12 * MB))).toEqual({ error: IMAGE_TOO_LARGE_MESSAGE });
  });

  it("GIF는 애니메이션 변환을 거친다", async () => {
    const converted = fileOf(3 * MB, "image/webp");
    shrinkAnimatedImage.mockResolvedValueOnce(converted);
    expect(await shrinkForUpload(fileOf(9 * MB, "image/gif"))).toEqual({ file: converted });
  });
});
