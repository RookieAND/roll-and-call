import { Check } from "lucide-react";

import { TIMELINE_STATE, type TimelineStep } from "../model/manage-timeline";

interface ManageTimelineDotProps {
  state: TimelineStep["state"];
}

export function ManageTimelineDot({ state }: ManageTimelineDotProps) {
  if (state === TIMELINE_STATE.done) {
    return (
      <span className="flex size-5.5 flex-none items-center justify-center rounded-full bg-success-solid">
        <Check size={13} strokeWidth={3} aria-hidden />
      </span>
    );
  }
  const borderClass = state === TIMELINE_STATE.current ? "border-primary-600" : "border-gray-300";
  return (
    <span
      className={`flex size-5.5 flex-none items-center justify-center rounded-full border-2 ${borderClass}`}
    >
      {state === TIMELINE_STATE.current && <span className="size-2 rounded-full bg-primary-600" />}
    </span>
  );
}
