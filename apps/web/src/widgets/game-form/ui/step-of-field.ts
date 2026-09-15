import { GAME_BASICS_FIELDS } from "./game-basics-fields";
import { GAME_MEDIA_FIELDS } from "./game-media-fields";
import type { WizardStep } from "./wizard-header";

export function stepOfField(field: string): WizardStep {
  if ((GAME_BASICS_FIELDS as readonly string[]).includes(field)) return 1;
  if ((GAME_MEDIA_FIELDS as readonly string[]).includes(field)) return 2;
  return 3;
}
