import { padTwoDigits } from "@/shared/lib";

export const WINDOW_START_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${padTwoDigits(hour)}:00`,
}));
