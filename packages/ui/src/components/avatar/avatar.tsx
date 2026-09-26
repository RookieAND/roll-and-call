"use client";

import type { VariantProps } from "class-variance-authority";
import { useState } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName } from "../../lib/state-props";
import { Tooltip } from "../tooltip/tooltip";
import { avatarColorFor } from "./avatar-color";
import { avatarVariants } from "./avatar-variants";

type AvatarState = VariantProps<typeof avatarVariants>;

export interface AvatarProps extends AvatarState {
  src?: string | null;
  name?: string | null;
  className?: StateClassName<AvatarState>;
}

// 이미지가 깨지면 이름 첫 글자로 대신한다. 실패한 주소만 기억하므로 src가 바뀌면 다시 시도한다.
export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const image = src && src !== failedSrc ? src : null;
  const trimmed = (name ?? "").trim();
  const initial = trimmed.charAt(0) || "?";
  const [background, foreground] = trimmed
    ? avatarColorFor(trimmed)
    : ["var(--rc-color-data-gray-bg)", "var(--rc-color-data-gray-ink)"];
  const face = (
    <span
      data-slot="avatar"
      data-size={size ?? undefined}
      className={cn(avatarVariants({ size }), resolveStateProp(className, { size }))}
      style={image ? undefined : { backgroundColor: background, color: foreground }}
    >
      {image ? (
        // plain img: Discord CDN avatars, no next/image remote config needed
        <img
          src={image}
          alt={name ?? ""}
          onError={() => setFailedSrc(image)}
          // 서버 렌더 이미지는 하이드레이션 전에 실패하면 onError를 놓친다. 붙는 순간 한 번 더 본다.
          ref={(element) => {
            if (element?.complete && element.naturalWidth === 0) setFailedSrc(image);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );

  if (!trimmed) return face;
  return <Tooltip content={trimmed}>{face}</Tooltip>;
}
