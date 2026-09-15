import type { VariantProps } from "class-variance-authority";

import { avatarColorFor } from "./avatar-color";
import { avatarVariants } from "./avatar-variants";
import { cn } from "./cn";
import { Tooltip } from "./tooltip";

export type AvatarProps = VariantProps<typeof avatarVariants> & {
  src?: string | null;
  name?: string | null;
  className?: string;
};

export function Avatar({ src, name, size, className }: AvatarProps) {
  const trimmed = (name ?? "").trim();
  const initial = trimmed.charAt(0) || "?";
  const [background, foreground] = trimmed ? avatarColorFor(trimmed) : ["#EAEAEF", "#8A8A95"];
  const face = (
    <span
      className={cn(avatarVariants({ size }), className)}
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
