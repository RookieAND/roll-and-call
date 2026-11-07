import { toast } from "@roll-and-call/ui";

import type { ActionResult } from "@/shared/api";

export function toastActionError({
  error,
  failed,
}: Pick<ActionResult, "failed"> & { error: string }) {
  if (failed) toast.danger(error);
  else toast.warning(error);
}
