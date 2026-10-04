import { describe, expect, it, vi } from "vitest";

import { IMAGE_TOO_LARGE_MESSAGE } from "../model/upload-rules";
import { shrinkForUpload } from "./shrink-for-upload";

const { shrinkImage } = vi.hoisted(() => ({ shrinkImage: vi.fn() }));
vi.mock("@/shared/api", () => ({ shrinkImage }));

const MB = 1024 * 1024;
const fileOf = (bytes: number) => new File([new Uint8Array(bytes)], "photo.jpg");

describe("shrinkForUpload", () => {
  it("8MB 원본도 줄인 결과가 5MB 이하면 올린다", async () => {
    const shrunk = fileOf(2 * MB);
    shrinkImage.mockResolvedValueOnce(shrunk);
    expect(await shrinkForUpload(fileOf(8 * MB))).toEqual({ file: shrunk });
  });

  it("줄여도 5MB를 넘으면 막는다", async () => {
    shrinkImage.mockResolvedValueOnce(fileOf(5 * MB + 1));
    expect(await shrinkForUpload(fileOf(8 * MB))).toEqual({ error: IMAGE_TOO_LARGE_MESSAGE });
  });
});
