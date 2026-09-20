"use client";

import { cva } from "class-variance-authority";

import { DraggingMessage } from "./dragging-message";
import { PickImageMessage } from "./pick-image-message";
import { UploadingMessage } from "./uploading-message";

const dropzone = cva(
  "flex aspect-video w-full flex-col items-center justify-center gap-075 rounded-500 border-[1.5px] border-dashed px-200 text-center transition-colors",
  {
    variants: {
      dragging: {
        true: "border-primary-500 bg-tinted-bg",
        false: "border-gray-300 bg-gray-50 hover:bg-gray-100",
      },
      invalid: { true: "border-danger-400", false: "" },
    },
    // 끌고 있는 동안에는 테두리가 그 상태를 말해야 하므로 오류 색을 덮지 않는다.
    compoundVariants: [{ dragging: true, invalid: true, class: "border-primary-500" }],
    defaultVariants: { dragging: false, invalid: false },
  },
);

interface ThumbnailDropzoneProps {
  uploading: boolean;
  dragging: boolean;
  invalid: boolean;
  onPick: () => void;
  onDraggingChange: (dragging: boolean) => void;
  onDrop: (file: File) => void;
}

// ponytail: 드롭 영역 전체가 파일 선택 버튼이라 Button 룩(텍스트 한 줄)과 달라 손코딩.
export function ThumbnailDropzone({
  uploading,
  dragging,
  invalid,
  onPick,
  onDraggingChange,
  onDrop,
}: ThumbnailDropzoneProps) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={uploading}
      onDragOver={(event) => {
        event.preventDefault();
        onDraggingChange(true);
      }}
      onDragLeave={() => onDraggingChange(false)}
      onDrop={(event) => {
        event.preventDefault();
        onDraggingChange(false);
        const file = event.dataTransfer.files[0];
        if (file) onDrop(file);
      }}
      className={dropzone({ dragging, invalid })}
    >
      {uploading ? <UploadingMessage /> : dragging ? <DraggingMessage /> : <PickImageMessage />}
    </button>
  );
}
