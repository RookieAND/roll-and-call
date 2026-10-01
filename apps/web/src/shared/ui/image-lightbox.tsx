"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { IconButton } from "@roll-and-call/ui";
import { X } from "lucide-react";

interface ImageLightboxProps {
  url: string | null;
  label: string;
  onClose: () => void;
}

export function ImageLightbox({ url, label, onClose }: ImageLightboxProps) {
  return (
    <Dialog.Root open={url !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-(--rc-z-overlay) bg-dim" />
        <Dialog.Popup className="fixed inset-0 z-(--rc-z-dialog) flex items-center justify-center p-200 outline-none">
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          {url && (
            <img
              src={url}
              alt={label}
              className="max-h-full max-w-full rounded-300 object-contain"
            />
          )}
          <Dialog.Close
            render={
              <IconButton
                aria-label="닫기"
                className="absolute top-4 right-4 h-11 w-11 bg-surface/85"
              >
                <X size={20} aria-hidden />
              </IconButton>
            }
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
