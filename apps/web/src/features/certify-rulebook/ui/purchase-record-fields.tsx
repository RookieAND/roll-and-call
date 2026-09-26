"use client";

import {
  Button,
  Field,
  HStack,
  IconButton,
  Progress,
  Text,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";

import { uploadCertPhoto } from "../api/upload-cert-photo";
import { certPhotoError } from "../model/cert-photo-error";
import { CERT_PHOTO_ACCEPT } from "../model/cert-photo-rules";
import type { PurchaseRecord } from "../model/purchase-record";

interface PurchaseRecordFieldsProps {
  value: PurchaseRecord;
  onChange: (value: PurchaseRecord) => void;
}

const BYTES_PER_MEGABYTE = 1024 * 1024;

// 구매 기록 캡처 한 장과 주문 번호·주문일. 캡처는 인증 사진과 같은 곳에 올린다.
export function PurchaseRecordFields({ value, onChange }: PurchaseRecordFieldsProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (picked: File) => {
    const invalid = certPhotoError(picked, CERT_PHOTO_ACCEPT);
    if (invalid) return setError(invalid);
    setError(null);
    setProgress(0);
    const result = await uploadCertPhoto(picked, setProgress).catch(() => ({
      error: "캡처를 올리지 못했습니다. 다시 올려 주세요.",
    }));
    setProgress(null);
    if ("error" in result) return setError(result.error);
    setFile({ name: picked.name, size: picked.size });
    onChange({ ...value, captureUrl: result.url });
  };

  return (
    <VStack gap="150">
      {value.captureUrl ? (
        <HStack
          align="center"
          gap="125"
          className="min-h-13 rounded-500 border border-gray-200 py-075 pr-075 pl-100"
        >
          {/* oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다. */}
          <img
            src={value.captureUrl}
            alt=""
            className="size-10 flex-none rounded-300 object-cover"
          />
          <VStack className="min-w-0 flex-1">
            <Text typography="body3" weight="bold">
              구매 기록 캡처
            </Text>
            {file && (
              <Text typography="body4" foreground="hint" truncate>
                {file.name} · {(file.size / BYTES_PER_MEGABYTE).toFixed(1)}MB
              </Text>
            )}
          </VStack>
          <IconButton
            aria-label="캡처 지우기"
            onClick={() => {
              setFile(null);
              onChange({ ...value, captureUrl: "" });
            }}
          >
            <X size={16} strokeWidth={2.4} />
          </IconButton>
        </HStack>
      ) : progress !== null ? (
        <VStack gap="075" className="rounded-500 border border-gray-200 px-175 py-150">
          <Text typography="body4" weight="bold" foreground="muted" numeric>
            올리는 중 {Math.round(progress * 100)}%
          </Text>
          <Progress value={progress * 100} max={100} className="h-1" aria-label="올리는 중" />
        </VStack>
      ) : (
        <Button
          variant="outline"
          colorPalette="primary"
          size="lg"
          onClick={() => fileInput.current?.click()}
          className="w-full justify-start border-dashed"
        >
          <Plus size={16} strokeWidth={2.4} aria-hidden />
          구매 기록 캡처 추가
        </Button>
      )}
      {error && (
        <Text typography="body4" foreground="warning" role="alert">
          {error}
        </Text>
      )}
      <input
        ref={fileInput}
        type="file"
        accept={CERT_PHOTO_ACCEPT}
        hidden
        onChange={(event) => {
          const picked = event.target.files?.[0];
          event.target.value = "";
          if (picked) void upload(picked);
        }}
      />
      <HStack gap="100" className="[&>*]:min-w-0 [&>*]:flex-1">
        <Field.Root label="주문번호" htmlFor="purchase-order-number">
          <TextInput
            id="purchase-order-number"
            maxLength={100}
            placeholder="예: 20260912-0031"
            value={value.orderNumber}
            onChange={(event) => onChange({ ...value, orderNumber: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="주문일" htmlFor="purchase-order-date">
          <TextInput
            id="purchase-order-date"
            maxLength={20}
            placeholder="예: 2026.09.12"
            value={value.orderDate}
            onChange={(event) => onChange({ ...value, orderDate: event.target.value })}
          />
        </Field.Root>
      </HStack>
    </VStack>
  );
}
