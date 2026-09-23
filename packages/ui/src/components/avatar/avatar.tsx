"use client";

import type { VariantProps } from "class-variance-authority";

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

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
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
      style={src ? undefined : { backgroundColor: background, color: foreground }}
    >
      {src ? (
        // plain img: Discord CDN avatars, no next/image remote config needed
        <img src={src} alt={name ?? ""} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );

  if (!trimmed) return face;
  return <Tooltip content={trimmed}>{face}</Tooltip>;
}
