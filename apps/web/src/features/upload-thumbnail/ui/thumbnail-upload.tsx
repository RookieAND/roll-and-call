"use client";

import { Button, Text, cn } from "@trpg/ui";
import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { uploadThumbnail } from "../api/upload-thumbnail";
import { formatBytes } from "./format-bytes";
import { imageFileError } from "./image-file-error";
import { uploadFailedMessage } from "./upload-failed-message";
import { IMAGE_ACCEPT } from "./upload-rules";

// ponytail: 스토리지 SDK가 진행률을 주지 않아 %가 아니라 "올리는 중" 스피너만 보인다.
export function ThumbnailUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
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

  const dropClass = cn(
    "flex aspect-video w-full flex-col items-center justify-center gap-075 rounded-500 border-[1.5px] border-dashed px-200 text-center transition-colors",
    dragging ? "border-primary-500 bg-tinted-bg" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
    error && !dragging && "border-danger-400",
  );

  return (
    <div id="thumbnailUrl" className="flex min-w-0 flex-col gap-075">
      <div className="flex items-baseline justify-between">
        <Text weight="bold" typography="body4" className="text-gray-700">
          썸네일
        </Text>
        <Text typography="body4" foreground="hint">
          선택
        </Text>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-500 border border-gray-200">
          <img src={value} alt="썸네일 미리보기" className="aspect-video w-full object-cover" />
          <div className="flex items-center gap-100 px-150 py-100">
            <div className="min-w-0 flex-1">
              <Text truncate weight="medium" typography="body4">
                {picked ? picked.name : "올린 이미지 · 16:9"}
              </Text>
              {picked && (
                <Text typography="body4" foreground="hint" className="block">
                  {formatBytes(picked.size)}
                </Text>
              )}
            </div>
            <Button variant="outline" size="sm" className="h-9" loading={uploading} onClick={pick}>
              교체
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="h-9"
              disabled={uploading}
              onClick={remove}
            >
              삭제
            </Button>
          </div>
        </div>
      ) : (
        // ponytail: 드롭 영역 전체가 파일 선택 버튼이라 Button 룩(텍스트 한 줄)과 달라 손코딩.
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) void upload(file);
          }}
          className={dropClass}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-gray-400" aria-hidden />
              <Text typography="body3" foreground="muted">
                올리는 중
              </Text>
            </>
          ) : dragging ? (
            <Text typography="subtitle2" className="text-tinted-ink">
              여기에 놓으면 올라갑니다
            </Text>
          ) : (
            <>
              <ImagePlus size={22} className="text-gray-400" aria-hidden />
              <Text typography="subtitle2">이미지 올리기</Text>
              <Text typography="body4" foreground="hint">
                16:9로 잘립니다 · JPG·PNG · 5MB 이하
              </Text>
            </>
          )}
        </button>
      )}

      {error ? (
        <div className="flex items-center justify-between gap-100">
          <Text typography="body4" foreground="danger" render={<p />}>
            {error}
          </Text>
          <Button variant="ghost" size="sm" className="h-9 shrink-0" onClick={pick}>
            다시 고르기
          </Button>
        </div>
      ) : (
        <Text typography="body4" foreground="hint" render={<p />}>
          목록과 상세 맨 위에 쓰입니다. 없으면 기본 그라데이션이 들어갑니다.
        </Text>
      )}

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
    </div>
  );
}
