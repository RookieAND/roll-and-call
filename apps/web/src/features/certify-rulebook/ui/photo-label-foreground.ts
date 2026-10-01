import { PHOTO_SLOT, type PhotoSlot } from "../model/photo-slot";

export function photoLabelForeground({
  status,
  selected,
}: {
  status: PhotoSlot["status"];
  selected: boolean;
}) {
  if (status === PHOTO_SLOT.error) return "warning";
  if (selected) return "primary";
  return "muted";
}
