import { NO_SHOW_STATUS_LABEL } from "@/entities/no-show";

export const NO_SHOW_STATUS_CHIPS = Object.entries(NO_SHOW_STATUS_LABEL).map(([value, label]) => ({
  label,
  value,
}));
