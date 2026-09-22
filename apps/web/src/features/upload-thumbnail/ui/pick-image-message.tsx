import { Text } from "@roll-and-call/ui";
import { Upload } from "lucide-react";

import { IconTile } from "@/shared/ui";

export function PickImageMessage() {
  return (
    <>
      <IconTile icon={Upload} tone="primary" />
      <Text typography="subtitle2" className="mt-025">
        이미지 올리기
      </Text>
      <Text typography="body4" foreground="hint">
        16:9로 잘립니다 · JPG·PNG · 5MB 이하
      </Text>
    </>
  );
}
