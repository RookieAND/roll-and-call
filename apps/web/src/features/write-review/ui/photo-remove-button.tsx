import { IconButton } from "@roll-and-call/ui";
import { X } from "lucide-react";

interface PhotoRemoveButtonProps {
  label: string;
  onRemove: () => void;
}

export function PhotoRemoveButton({ label, onRemove }: PhotoRemoveButtonProps) {
  return (
    <IconButton
      variant="solid"
      size="sm"
      aria-label={`${label} 삭제`}
      onClick={onRemove}
      className="absolute top-050 right-050"
    >
      <X size={14} aria-hidden />
    </IconButton>
  );
}
