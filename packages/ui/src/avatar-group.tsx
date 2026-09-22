"use client";

import type { VariantProps } from "class-variance-authority";

import { Avatar } from "./avatar";
import { avatarVariants } from "./avatar-variants";
import { cn } from "./cn";
import { Tooltip } from "./tooltip";

export type AvatarPerson = { src?: string | null; name?: string | null };

export interface AvatarGroupProps extends VariantProps<typeof avatarVariants> {
  people: AvatarPerson[];
  max?: number;
  className?: string;
}

export function AvatarGroup({ people, max = 3, size, className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const hiddenNames = people
    .slice(max)
    .map((person) => person.name?.trim())
    .filter(Boolean)
    .join(", ");
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((person, index) => (
        <span
          key={index}
          className="-ml-100 inline-flex rounded-full ring-2 ring-surface first:ml-0"
        >
          <Avatar src={person.src} name={person.name} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <Tooltip content={hiddenNames || `${extra}명 더`}>
          <span
            className={cn(
              avatarVariants({ size }),
              "-ml-100 bg-gray-100 text-gray-600 ring-2 ring-surface",
            )}
          >
            +{extra}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
