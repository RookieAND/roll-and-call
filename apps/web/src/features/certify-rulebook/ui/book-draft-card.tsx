"use client";

import { Badge, HStack, SegmentedControl, Text, VStack } from "@roll-and-call/ui";
import { Camera, CircleAlert } from "lucide-react";
import { useRef, useState } from "react";

import {
  CERT_FORMAT,
  CERT_FORMAT_LABEL,
  CERT_GUIDE,
  CERT_PROOF,
  CERT_PROOF_LABEL,
  CERT_PROOFS,
  CERT_SHOT,
  CERT_SHOT_LABEL,
  CERT_SHOTS,
  ProofArt,
  RULEBOOK_KIND_LABEL,
  ShotArt,
  type CertFormat,
  type MyRulebook,
} from "@/entities/rulebook";

import { uploadCertPhoto } from "../api/upload-cert-photo";
import type { BookDraft } from "../model/book-draft";
import { certPhotoError } from "../model/cert-photo-error";
import { CERT_PHOTO_ACCEPT, CERT_RECEIPT_ACCEPT } from "../model/cert-photo-rules";
import { PHOTO_SLOT, slotUrl, type PhotoSlot } from "../model/photo-slot";
import { isProofKey, slotOf, type SlotKey } from "../model/slot-of";
import { EbookFields } from "./ebook-fields";
import { PhotoTile } from "./photo-tile";
import { PurchaseRecordRow } from "./purchase-record-row";

interface BookDraftCardProps {
  rulebook: MyRulebook;
  draft: BookDraft;
  nickname: string;
  // 재신청 화면은 비운 칸을 점선으로 먼저 보여 준다.
  highlightEmpty: boolean;
  update: (updater: (draft: BookDraft) => BookDraft) => void;
}

// 책 한 권의 신청 칸. 실물은 사진 세 칸, 전자책은 구매 내역·영수증 두 칸과 주문 정보.
export function BookDraftCard({
  rulebook,
  draft,
  nickname,
  highlightEmpty,
  update,
}: BookDraftCardProps) {
  const ebook = draft.format === CERT_FORMAT.ebook;
  const keys: readonly SlotKey[] = ebook ? CERT_PROOFS : CERT_SHOTS;
  const firstEmpty = keys.find((key) => !slotUrl(slotOf(draft, key)));
  const [selectedKey, setSelectedKey] = useState<SlotKey>(firstEmpty ?? keys[0]!);
  const current: SlotKey = keys.includes(selectedKey) ? selectedKey : keys[0]!;
  const photoInput = useRef<HTMLInputElement>(null);
  const receiptInput = useRef<HTMLInputElement>(null);

  const setSlot = (key: SlotKey, slot: PhotoSlot) =>
    update((previous) =>
      isProofKey(key)
        ? { ...previous, proofs: { ...previous.proofs, [key]: slot } }
        : { ...previous, shots: { ...previous.shots, [key]: slot } },
    );

  const pick = (key: SlotKey) => {
    setSelectedKey(key);
    const status = slotOf(draft, key).status;
    if (status === PHOTO_SLOT.uploading || slotUrl(slotOf(draft, key))) return;
    (key === CERT_PROOF.receipt ? receiptInput : photoInput).current?.click();
  };

  const upload = async (key: SlotKey, file: File) => {
    const accept = key === CERT_PROOF.receipt ? CERT_RECEIPT_ACCEPT : CERT_PHOTO_ACCEPT;
    const invalid = certPhotoError(file, accept);
    if (invalid) return setSlot(key, { status: PHOTO_SLOT.error, message: invalid });
    setSlot(key, { status: PHOTO_SLOT.uploading, progress: 0 });
    const result = await uploadCertPhoto(file, (progress) =>
      setSlot(key, { status: PHOTO_SLOT.uploading, progress }),
    ).catch(() => ({ error: "사진을 올리지 못했습니다. 다시 올려 주세요." }));
    setSlot(
      key,
      "url" in result
        ? { status: PHOTO_SLOT.done, url: result.url }
        : { status: PHOTO_SLOT.error, message: result.error },
    );
    const next = keys.find((candidate) => candidate !== key && !slotUrl(slotOf(draft, candidate)));
    if ("url" in result && next) setSelectedKey(next);
  };

  const selectedSlot = slotOf(draft, current);
  const errorMessage = selectedSlot.status === PHOTO_SLOT.error ? selectedSlot.message : null;
  const label = (key: SlotKey) => (isProofKey(key) ? CERT_PROOF_LABEL[key] : CERT_SHOT_LABEL[key]);
  const fileInput = (key: SlotKey) => (
    <input
      ref={key === CERT_PROOF.receipt ? receiptInput : photoInput}
      type="file"
      accept={key === CERT_PROOF.receipt ? CERT_RECEIPT_ACCEPT : CERT_PHOTO_ACCEPT}
      hidden
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) void upload(current, file);
      }}
    />
  );

  return (
    <VStack gap="200">
      <VStack gap="050">
        <HStack align="center" gap="100">
          <Text typography="heading1" render={<h2 />}>
            {rulebook.shortName}
          </Text>
          <Badge>{RULEBOOK_KIND_LABEL[rulebook.kind]}</Badge>
        </HStack>
        <Text typography="body3" foreground="muted">
          {`${rulebook.categoryName} ${rulebook.edition}`.trim()}
        </Text>
      </VStack>

      <SegmentedControl.Root
        value={draft.format}
        onValueChange={(format) =>
          update((previous) => ({ ...previous, format: format as CertFormat }))
        }
        aria-label="인증 형식"
      >
        {Object.values(CERT_FORMAT).map((format) => (
          <SegmentedControl.Item key={format} value={format}>
            {CERT_FORMAT_LABEL[format]}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>

      <VStack gap="125">
        <div className="flex gap-100">
          {keys.map((key) => (
            <PhotoTile
              key={key}
              label={label(key)}
              example={isProofKey(key) ? <ProofArt proof={key} /> : <ShotArt shot={key} />}
              slot={slotOf(draft, key)}
              selected={key === current}
              needed={highlightEmpty}
              square={isProofKey(key)}
              onPick={() => pick(key)}
              onRemove={() => {
                setSlot(key, { status: PHOTO_SLOT.empty });
                setSelectedKey(key);
              }}
            />
          ))}
        </div>
        {errorMessage && (
          <HStack align="start" gap="075" role="alert">
            <CircleAlert
              size={16}
              strokeWidth={2.1}
              aria-hidden
              className="mt-025 flex-none text-warning-600"
            />
            <Text typography="body4" weight="bold" foreground="warning">
              {errorMessage}
            </Text>
          </HStack>
        )}
        <HStack align="start" gap="075">
          <Camera
            size={16}
            strokeWidth={2.1}
            aria-hidden
            className="mt-025 flex-none text-gray-600"
          />
          <Text typography="body3" foreground="muted" className="break-keep">
            {CERT_GUIDE[current]}
          </Text>
        </HStack>
        {current === CERT_SHOT.front && (
          <HStack align="center" gap="100">
            <Text typography="body4" foreground="muted">
              쪽지에 적을 닉네임
            </Text>
            <Text
              typography="body4"
              weight="bold"
              className="rounded-200 border border-gray-200 bg-surface px-100 py-025 font-mono"
            >
              {nickname}
            </Text>
          </HStack>
        )}
        {fileInput(CERT_SHOT.front)}
        {fileInput(CERT_PROOF.receipt)}
      </VStack>

      {ebook ? (
        <EbookFields
          idPrefix={`cert-${rulebook.id}`}
          draft={draft}
          onChange={(changes) => update((previous) => ({ ...previous, ...changes }))}
        />
      ) : (
        <PurchaseRecordRow
          value={draft.purchase}
          onChange={(purchase) => update((previous) => ({ ...previous, purchase }))}
        />
      )}
    </VStack>
  );
}
