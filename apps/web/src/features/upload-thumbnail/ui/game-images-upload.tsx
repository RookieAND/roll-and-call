"use client";

import { Button, cn, Grid, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useRef, useState } from "react";

import { uploadThumbnail } from "../api/upload-thumbnail";
import { imageFileError } from "../model/image-file-error";
import { uploadFailedMessage } from "../model/upload-failed-message";
import { IMAGE_ACCEPT } from "../model/upload-rules";

interface GameImagesUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max: number;
}

// ponytail: 순서 변경은 HTML5 드래그라 데스크톱 전용. 터치 정렬이 필요해지면 위·아래 이동 버튼을 붙인다.
export function GameImagesUpload({ value, onChange, max }: GameImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const remaining = max - value.length;
  const canAdd = remaining > 0 && !uploading;

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    // 같은 파일을 지웠다가 다시 고를 수 있게 비운다.
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);

    const invalid = files.map(imageFileError).find(Boolean);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (files.length > remaining) {
      setError(`이미지는 최대 ${max}장까지입니다. 앞의 ${remaining}장만 올립니다.`);
    }

    setUploading(true);
    const urls = [...value];
    try {
      for (const file of files.slice(0, remaining)) {
        const result = await uploadThumbnail(file);
        if ("error" in result) {
          setError(uploadFailedMessage(result.error));
          break;
        }
        urls.push(result.url);
      }
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadFailedMessage());
    } finally {
      onChange(urls);
      setUploading(false);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  }

  function move(from: number, to: number) {
    if (from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange(next);
  }

  return (
    <VStack id="images" gap="075">
      <HStack align="baseline" justify="between">
        <Text weight="bold" typography="body4">
          추가 이미지
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {value.length} / {max}
        </Text>
      </HStack>

      <Grid cols={5} gap="075">
        {value.map((url, index) => (
          <div
            key={url}
            draggable={!uploading}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) move(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={cn(
              "relative aspect-square cursor-grab overflow-hidden rounded-400",
              dragIndex === index && "opacity-55",
            )}
          >
            <img
              src={url}
              alt={`추가 이미지 ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <IconButton
              aria-label={`추가 이미지 ${index + 1} 삭제`}
              onClick={() => remove(index)}
              disabled={uploading}
              className="absolute top-0 right-0 h-11 w-11 bg-transparent hover:bg-transparent"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-surface/85">
                <X size={14} aria-hidden />
              </span>
            </IconButton>
          </div>
        ))}
        {remaining > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={!canAdd}
            loading={uploading}
            className="aspect-square h-auto min-h-0 rounded-400 border-dashed px-0 text-body4"
          >
            + 추가
          </Button>
        )}
        {Array.from({ length: Math.max(remaining - 1, 0) }, (_, index) => (
          <div
            key={index}
            aria-hidden
            className="aspect-square rounded-400 border border-dashed border-gray-300 bg-gray-50"
          />
        ))}
      </Grid>

      {error ? (
        <Text typography="body4" foreground="danger" render={<p />}>
          {error}
        </Text>
      ) : (
        <Text typography="body4" foreground="hint" render={<p />}>
          각 이미지 당 최대 5MB 까지 업로드 가능합니다.
        </Text>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </VStack>
  );
}
