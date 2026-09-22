"use client";

import { Calendar } from "@roll-and-call/ui";
import { useState } from "react";

export const ScheduleCandidate = () => {
  const [value, setValue] = useState<string | undefined>("2026-09-23");
  return <Calendar value={value} onSelect={setValue} />;
};

export const RecruitDeadline = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return <Calendar value={value} onSelect={setValue} min="2026-09-23" />;
};

export const ConfirmedSessionDate = () => {
  const [value, setValue] = useState<string | undefined>("2026-09-30");
  return <Calendar value={value} onSelect={setValue} min="2026-09-01" max="2026-10-15" />;
};
