"use client";

import { Switch, Text } from "@trpg/ui";

export function ThumbnailSpoilerField({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (spoiler: boolean) => void;
}) {
  return (
    <div className="flex min-h-11 items-start justify-between gap-3">
      <div className="min-w-0">
        <Text
          typography="subtitle2"
          render={<label htmlFor="thumbnailSpoiler" />}
          className="block"
        >
          썸네일 가리기
        </Text>
        <Text
          typography="body4"
          foreground="hint"
          render={<p />}
          id="thumbnailSpoiler-hint"
          className="mt-0.5"
        >
          고어·잔혹 묘사가 있으면 켜 주세요. 목록에서는 흐리게, 상세에서는 눌러야 보입니다.
        </Text>
      </div>
      <Switch
        id="thumbnailSpoiler"
        checked={value}
        onCheckedChange={onChange}
        aria-describedby="thumbnailSpoiler-hint"
        className="mt-0.5"
      />
    </div>
  );
}
