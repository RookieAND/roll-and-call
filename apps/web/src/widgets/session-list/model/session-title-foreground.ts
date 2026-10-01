import { SESSION_CHIP, type SessionCardModel } from "./session-card-model";

export function sessionTitleForeground(model: SessionCardModel): "danger" | "muted" | "normal" {
  if (model.titleDanger) return "danger";
  if (model.chip === SESSION_CHIP.ended) return "muted";
  return "normal";
}
