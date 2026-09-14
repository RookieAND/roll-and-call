"use client";

import { Button, IconButton, Text } from "@trpg/ui";
import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadThumbnail } from "../api/upload-thumbnail";

const MAX_BYTES = 5 * 1024 * 1024;

// 시놉시스·진행에 쓰는 이미지 여러 장. 올린 순서대로 상세 갤러리에 보인다.
// 업로드 경로(스토리지 버킷)는 썸네일과 같다.
export function GameImagesUpload({
  value,
  onChange,
  max,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const remaining = max - value.length;
  const canAdd = remaining > 0 && !uploading;

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // 같은 파일을 지웠다가 다시 고를 수 있게 비운다.
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);

    if (files.some((f) => !f.type.startsWith("image/") || f.size > MAX_BYTES)) {
      setError("5MB 이하 이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (files.length > remaining) {
      setError(`이미지는 최대 ${max}장까지예요. 앞의 ${remaining}장만 올립니다.`);
    }

    setUploading(true);
    try {
      const urls = [...value];
      for (const file of files.slice(0, remaining)) {
        const result = await uploadThumbnail(file);
        if ("error" in result) {
          setError(result.error);
          break;
        }
        urls.push(result.url);
      }
      onChange(urls);
    } finally {
      setUploading(false);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div id="images" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Text typography="subtitle1">진행 이미지</Text>
        <Text typography="body4" foreground="hint" className="tabular-nums">
          {value.length} / {max}
        </Text>
      </div>
      <Text typography="body4" foreground="muted">
        시놉시스나 진행에 필요한 이미지를 올려 주세요. 구인 상세에 올린 순서대로 보입니다.
      </Text>

      <div className="grid grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
          >
            <img src={url} alt={`진행 이미지 ${i + 1}`} className="h-full w-full object-cover" />
            <IconButton
              size="sm"
              aria-label={`진행 이미지 ${i + 1} 삭제`}
              onClick={() => remove(i)}
              disabled={uploading}
              className="absolute top-1 right-1 bg-surface/85"
            >
              <X size={16} aria-hidden />
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
            className="aspect-square h-auto flex-col gap-1 border-dashed text-xs"
          >
            <ImagePlus size={20} aria-hidden />
            추가
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      {error && (
        <Text typography="body4" foreground="danger">
          {error}
        </Text>
      )}
    </div>
  );
}
