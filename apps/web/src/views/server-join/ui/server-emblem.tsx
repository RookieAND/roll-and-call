import { cn } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import { ServerIcon } from "@/shared/ui";

import { EMBLEM_MARKS } from "../model/emblem-marks";
import type { JoinScreenStatus } from "../model/join-screen-status";

interface ServerEmblemProps {
  name: string;
  icon: string | null;
  status: JoinScreenStatus;
}

export function ServerEmblem({ name, icon, status }: ServerEmblemProps) {
  const mark = EMBLEM_MARKS[status];
  return (
    <div className="relative size-[104px] flex-none">
      {status === "checking" && (
        <span className="absolute inset-0 animate-join-pulse rounded-800 border-3 border-discord" />
      )}
      <div className="relative flex size-full items-center justify-center rounded-800 bg-surface shadow-[0_14px_34px_rgb(23_23_28/0.14),0_0_0_1px_var(--rc-color-border-subtle)]">
        <span className={cn("flex", status === "denied" && "opacity-50")}>
          <ServerIcon name={name} icon={icon} size="xl" tone="primary" />
        </span>
      </div>
      {!isUndefined(mark) && (
        <span
          className={cn(
            "absolute -right-100 -bottom-100 flex size-[34px] items-center justify-center rounded-full text-white shadow-[0_0_0_4px_var(--rc-color-bg-canvas-base)]",
            mark.className,
          )}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d={mark.path} />
          </svg>
        </span>
      )}
    </div>
  );
}
