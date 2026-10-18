"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ImageIcon, Move, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { BannerImage } from "@/shared/ui";

import { uploadThumbnail } from "../api/upload-thumbnail";
import { imageFileError } from "../model/image-file-error";
import { uploadFailedMessage } from "../model/upload-failed-message";
import { IMAGE_ACCEPT } from "../model/upload-rules";
import { BannerActionButton } from "./banner-action-button";
import { BannerCropSheet } from "./banner-crop-sheet";

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
  // 이번에 고른 원본. 있으면 위치 조정이 원본에서 다시 자르고, 없으면 올라가 있는 배너를 자른다.
  const [original, setOriginal] = useState<string | null>(null);
  const [cropping, setCropping] = useState<string | null>(null);

  function pick(file: File) {
    setError(null);
    const invalid = imageFileError(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginal(url);
    setCropping(url);
  }

  async function upload(file: File) {
    setCropping(null);
    setError(null);
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
      <div className="relative aspect-[3/1] overflow-hidden rounded-400 border border-dashed border-gray-300 bg-gray-50">
        {value && <BannerImage src={value} alt="배너 미리보기" />}
        <HStack gap="100" className="absolute top-100 right-100">
          <BannerActionButton
            icon={Move}
            label="위치 조정"
            disabled={!value || uploading}
            onClick={() => setCropping(original ?? value)}
          />
          <BannerActionButton
            icon={ImageIcon}
            label="이미지 바꾸기"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          />
          <BannerActionButton
            icon={Trash2}
            label="배너 지우기"
            disabled={!value || uploading}
            onClick={() => {
              setOriginal(null);
              onChange("");
            }}
          />
        </HStack>
      </div>
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
          if (file) pick(file);
        }}
      />
      <BannerCropSheet
        imageUrl={cropping}
        onApply={(file) => void upload(file)}
        onClose={() => setCropping(null)}
      />
    </VStack>
  );
}
