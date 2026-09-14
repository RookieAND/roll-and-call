import { Calendar } from "@trpg/ui";

export const Selected = () => <Calendar value="2026-09-20" onSelect={() => {}} />;

export const WithBounds = () => (
  <Calendar value="2026-09-18" min="2026-09-14" max="2026-09-27" onSelect={() => {}} />
);
