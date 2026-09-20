"use client";

import { Switch, Text, cn } from "@trpg/ui";

export function ThumbnailSpoilerField({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (spoiler: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-400 border px-3 py-3",
        value ? "border-tinted-border bg-tinted-bg" : "border-gray-200",
      )}
    >
      <div className="min-w-0 flex-1">
        <Text
          typography="subtitle2"
          render={<label htmlFor="thumbnailSpoiler" />}
          className="block"
        >
          썸네일 스포일러 설정
        </Text>
        <Text
          typography="body4"
          foreground="hint"
          render={<p />}
          id="thumbnailSpoiler-hint"
          className="mt-0.5"
        >
          목록과 상세 페이지에서 이미지를 흐리게 덮습니다
        </Text>
      </div>
      <Switch
        id="thumbnailSpoiler"
        checked={value}
        onCheckedChange={onChange}
        aria-describedby="thumbnailSpoiler-hint"
        className="shrink-0"
      />
    </div>
  );
}
