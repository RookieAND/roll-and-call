"use client";

import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { useRef, useState } from "react";

import { uploadThumbnail } from "../api/upload-thumbnail";
import { imageFileError } from "../model/image-file-error";
import { uploadFailedMessage } from "../model/upload-failed-message";
import { IMAGE_ACCEPT } from "../model/upload-rules";

interface ProfileBannerUploadProps {
  serverId: string;
  value: string;
  onChange: (url: string) => void;
}

// 프로필 배너(3:1). 게임 썸네일과 같은 저장소·축소 규칙을 쓴다. 바꾸거나 지워도 이전 파일은 지우지 않는다.
export function ProfileBannerUpload({ serverId, value, onChange }: ProfileBannerUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    const invalid = imageFileError(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setUploading(true);
    try {
      const result = await uploadThumbnail({ serverId, file });
      if ("error" in result) setError(result.error);
      else onChange(result.url);
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadFailedMessage());
    } finally {
      setUploading(false);
    }
  }

  return (
    <VStack gap="100">
      <Text typography="subtitle2">배너 (선택)</Text>
      <div className="relative aspect-[3/1] max-h-40 overflow-hidden rounded-400 desktop:max-w-120 border border-dashed border-gray-300 bg-gray-50">
        {/* ponytail: 업로드한 이미지는 외부 저장소 주소라 next/image 대신 img로 그린다. */}
        {value && <img src={value} alt="배너 미리보기" className="size-full object-cover" />}
      </div>
      <HStack gap="100" className="[&>*]:min-h-11 [&>*]:flex-1">
        <Button
          type="button"
          variant="outline"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          이미지 바꾸기
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!value || uploading}
          onClick={() => onChange("")}
        >
          배너 지우기
        </Button>
      </HStack>
      <Text typography="body4" foreground={error ? "danger" : "hint"}>
        {error ?? "배너가 없으면 강조색 면으로 보입니다."}
      </Text>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
    </VStack>
  );
}
