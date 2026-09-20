import { Text } from "@trpg/ui";
import { ImagePlus } from "lucide-react";

export function PickImageMessage() {
  return (
    <>
      <ImagePlus size={22} className="text-gray-400" aria-hidden />
      <Text typography="subtitle2">이미지 올리기</Text>
      <Text typography="body4" foreground="hint">
        16:9로 잘립니다 · JPG·PNG · 5MB 이하
      </Text>
    </>
  );
}
