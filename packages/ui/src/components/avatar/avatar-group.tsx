"use client";

import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName } from "../../lib/state-props";
import { Tooltip } from "../tooltip/tooltip";
import { Avatar } from "./avatar";
import { avatarVariants } from "./avatar-variants";

export type AvatarPerson = { src?: string | null; name?: string | null };

type AvatarGroupState = VariantProps<typeof avatarVariants> & { count: number };

export interface AvatarGroupProps extends VariantProps<typeof avatarVariants> {
  people: AvatarPerson[];
  max?: number;
  className?: StateClassName<AvatarGroupState>;
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
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center",
        resolveStateProp(className, { size, count: people.length }),
      )}
    >
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
            data-slot="avatar-group-overflow"
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
