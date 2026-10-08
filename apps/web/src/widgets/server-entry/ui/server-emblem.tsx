import { cn } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import { ServerIcon } from "@/shared/ui";

export interface EmblemMark {
  path: string;
  className: string;
}

interface ServerEmblemProps {
  name: string;
  icon: string | null;
  mark?: EmblemMark;
  dimmed?: boolean;
}

const PULSE_DELAYS = ["0s", "1.3s"] as const;

// 서버 아이콘 둘레로 번지는 물결 두 겹과, 오른쪽 아래에 붙는 상태 표시.
export function ServerEmblem({ name, icon, mark, dimmed = false }: ServerEmblemProps) {
  return (
    <div className="relative size-[104px] flex-none">
      {PULSE_DELAYS.map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="absolute inset-0 animate-join-pulse rounded-800 border-2 border-discord opacity-0"
          style={{ animationDelay: delay }}
        />
      ))}
      <div className="relative flex size-full items-center justify-center rounded-800 bg-surface shadow-[0_14px_34px_rgb(23_23_28/0.14),0_0_0_1px_var(--rc-color-border-subtle)]">
        <span className={cn("flex", dimmed && "opacity-50")}>
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
