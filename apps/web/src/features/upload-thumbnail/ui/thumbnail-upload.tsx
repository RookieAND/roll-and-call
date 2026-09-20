"use client";

import { HStack, Text, VStack } from "@trpg/ui";
import { useRef, useState } from "react";

import { uploadThumbnail } from "../api/upload-thumbnail";
import { imageFileError } from "./image-file-error";
import { ThumbnailDropzone } from "./thumbnail-dropzone";
import { ThumbnailError } from "./thumbnail-error";
import { ThumbnailHint } from "./thumbnail-hint";
import { ThumbnailPreview } from "./thumbnail-preview";
import { uploadFailedMessage } from "./upload-failed-message";
import { IMAGE_ACCEPT } from "./upload-rules";

interface ThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

// ponytail: 스토리지 SDK가 진행률을 주지 않아 %가 아니라 "올리는 중" 스피너만 보인다.
export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [picked, setPicked] = useState<{ name: string; size: number } | null>(null);

  const pick = () => inputRef.current?.click();

  async function upload(file: File) {
    setError(null);
    const invalid = imageFileError(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setUploading(true);
    try {
      const result = await uploadThumbnail(file);
      if ("error" in result) {
        setError(uploadFailedMessage(result.error));
        return;
      }
      onChange(result.url);
      setPicked({ name: file.name, size: file.size });
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadFailedMessage());
    } finally {
      setUploading(false);
    }
  }

  function remove() {
    onChange("");
    setPicked(null);
  }

  return (
    <VStack id="thumbnailUrl" gap="075" className="min-w-0">
      <HStack align="baseline" justify="between">
        <Text weight="bold" typography="body4" className="text-gray-700">
          썸네일
        </Text>
        <Text typography="body4" foreground="hint">
          선택
        </Text>
      </HStack>

      {value ? (
        <ThumbnailPreview
          url={value}
          picked={picked}
          uploading={uploading}
          onReplace={pick}
          onRemove={remove}
        />
      ) : (
        <ThumbnailDropzone
          uploading={uploading}
          dragging={dragging}
          invalid={error !== null}
          onPick={pick}
          onDraggingChange={setDragging}
          onDrop={(file) => void upload(file)}
        />
      )}

      {error ? <ThumbnailError message={error} onRetry={pick} /> : <ThumbnailHint />}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // 같은 파일을 지웠다가 다시 고를 수 있게 비운다.
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
    </VStack>
  );
}
