import { SECTION_FIELDS, type WizardStepConfig } from "./game-form-steps";

export function stepOfField(field: string, steps: readonly WizardStepConfig[]) {
  const index = steps.findIndex((step) =>
    step.sections.some((section) => (SECTION_FIELDS[section] as readonly string[]).includes(field)),
  );
  return index === -1 ? steps.length - 1 : index;
}
