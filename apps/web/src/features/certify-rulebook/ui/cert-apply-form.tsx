"use client";

import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { Info } from "lucide-react";
import { useRef, useState } from "react";

import {
  CERT_SHOT,
  CERT_SHOTS,
  CERT_STATE,
  type CertShot,
  type MyRulebook,
} from "@/entities/rulebook";
import { useAction } from "@/shared/ui";

import { submitCertification } from "../api/submit-certification";
import { uploadCertPhoto } from "../api/upload-cert-photo";
import { applyHint } from "../model/apply-hint";
import { canApplyFor } from "../model/can-apply-for";
import { certPhotoError } from "../model/cert-photo-error";
import { CERT_PHOTO_ACCEPT } from "../model/cert-photo-rules";
import type { CertPhotos } from "../model/cert-photos";
import { initialSlots } from "../model/initial-slots";
import { PHOTO_SLOT, type PhotoSlot } from "../model/photo-slot";
import { CertRulebookSheet } from "./cert-rulebook-sheet";
import { PhotoTile } from "./photo-tile";
import { RulebookField } from "./rulebook-field";
import { RulebookRequestSheet } from "./rulebook-request-sheet";
import { ShotGuide } from "./shot-guide";
import { StepHeading } from "./step-heading";

const CHECKS = [
  "인증되면 프로필에 룰북 배지로 공개됩니다.",
  "인증이 유지되는 동안 사진을 보관합니다.",
];

interface CertApplyFormProps {
  rulebooks: MyRulebook[];
  initialRulebookId: string | null;
  nickname: string;
}

export function CertApplyForm({ rulebooks, initialRulebookId, nickname }: CertApplyFormProps) {
  const initial = rulebooks.find(
    (rulebook) => rulebook.id === initialRulebookId && canApplyFor(rulebook),
  );
  const [rulebookId, setRulebookId] = useState(initial?.id ?? null);
  const [slots, setSlots] = useState(() => initialSlots(initial));
  const [selectedShot, setSelectedShot] = useState<CertShot>(CERT_SHOT.front);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { pending, run } = useAction();

  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  const photoCount = CERT_SHOTS.filter((shot) => slots[shot].status === PHOTO_SLOT.done).length;
  const hint = applyHint(Boolean(rulebook), photoCount);

  const setSlot = (shot: CertShot, slot: PhotoSlot) =>
    setSlots((current) => ({ ...current, [shot]: slot }));

  const selectRulebook = (id: string) => {
    setRulebookId(id);
    const next = rulebooks.find((candidate) => candidate.id === id);
    if (next?.state === CERT_STATE.rejected) setSlots(initialSlots(next));
  };

  const pickShot = (shot: CertShot) => {
    setSelectedShot(shot);
    if (slots[shot].status !== PHOTO_SLOT.done && slots[shot].status !== PHOTO_SLOT.uploading) {
      fileInput.current?.click();
    }
  };

  const upload = async (file: File) => {
    const shot = selectedShot;
    const invalid = certPhotoError(file);
    if (invalid) return setSlot(shot, { status: PHOTO_SLOT.error, message: invalid });
    setSlot(shot, { status: PHOTO_SLOT.uploading, progress: 0 });
    const result = await uploadCertPhoto(file, (progress) =>
      setSlot(shot, { status: PHOTO_SLOT.uploading, progress }),
    ).catch(() => ({ error: "사진을 올리지 못했습니다. 다시 올려 주세요." }));
    setSlot(
      shot,
      "url" in result
        ? { status: PHOTO_SLOT.done, url: result.url }
        : { status: PHOTO_SLOT.error, message: result.error },
    );
    const nextEmpty = CERT_SHOTS.find(
      (candidate) => candidate !== shot && slots[candidate].status === PHOTO_SLOT.empty,
    );
    if ("url" in result && nextEmpty) setSelectedShot(nextEmpty);
  };

  const submit = () => {
    if (!rulebookId) return;
    const photos = Object.fromEntries(
      CERT_SHOTS.map((shot) => {
        const slot = slots[shot];
        return [shot, slot.status === PHOTO_SLOT.done ? slot.url : ""];
      }),
    ) as CertPhotos;
    run(() => submitCertification(rulebookId, photos));
  };

  const selectedError =
    slots[selectedShot].status === PHOTO_SLOT.error ? slots[selectedShot] : null;

  return (
    <>
      <Container size="sm">
        <VStack gap="300" className="pt-225 pb-250">
          <Text typography="body2" foreground="muted" render={<p />} className="[text-wrap:pretty]">
            실물 룰북 사진 3장으로 인증합니다.
            <br />
            운영진이 확인하면 그 룰북으로 구인을 열 수 있습니다.
            <br />
            <Text weight="bold" foreground="normal">
              전자책과 PDF는 인증할 수 없습니다.
            </Text>
          </Text>

          <VStack gap="125" render={<section />}>
            <StepHeading step={1} title="룰북" />
            <RulebookField rulebook={rulebook} onOpen={() => setPickerOpen(true)} />
          </VStack>

          <VStack gap="125" render={<section />}>
            <StepHeading
              step={2}
              title="사진 3장"
              aside={
                <Text typography="body3" weight="bold" foreground="muted" numeric>
                  {photoCount} / 3
                </Text>
              }
            />
            <div className="flex gap-100">
              {CERT_SHOTS.map((shot) => (
                <PhotoTile
                  key={shot}
                  shot={shot}
                  slot={slots[shot]}
                  selected={shot === selectedShot}
                  onPick={() => pickShot(shot)}
                  onRemove={() => {
                    setSlot(shot, { status: PHOTO_SLOT.empty });
                    setSelectedShot(shot);
                  }}
                />
              ))}
            </div>
            {selectedError && (
              <Text typography="body4" foreground="warning" role="alert">
                {selectedError.message}
              </Text>
            )}
            <ShotGuide shot={selectedShot} nickname={nickname} />
            <Text typography="body4" foreground="hint" render={<p />}>
              JPG, PNG 사진만 올릴 수 있습니다.
              <br />한 장에 10MB까지 올릴 수 있습니다.
            </Text>
            <input
              ref={fileInput}
              type="file"
              accept={CERT_PHOTO_ACCEPT}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void upload(file);
              }}
            />
          </VStack>

          <VStack gap="125" render={<section />}>
            <StepHeading step={3} title="제출하기 전에 확인해 주세요" />
            <VStack gap="100" render={<ul />}>
              {CHECKS.map((check) => (
                <Text
                  key={check}
                  typography="body3"
                  foreground="muted"
                  render={<li />}
                  className="flex gap-100"
                >
                  <Info
                    size={16}
                    strokeWidth={2.2}
                    aria-hidden
                    className="mt-025 flex-none text-hint"
                  />
                  {check}
                </Text>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Container>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <VStack gap="100">
              {hint && (
                <Text typography="body4" weight="medium" foreground="muted" className="text-center">
                  {hint}
                </Text>
              )}
              <Button
                size="lg"
                className="w-full"
                disabled={Boolean(hint)}
                loading={pending}
                onClick={submit}
              >
                인증 신청
              </Button>
            </VStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

      <CertRulebookSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        rulebooks={rulebooks}
        selectedId={rulebookId}
        onSelect={selectRulebook}
        onRequest={() => {
          setPickerOpen(false);
          setRequestOpen(true);
        }}
      />
      <RulebookRequestSheet open={requestOpen} onOpenChange={setRequestOpen} />
    </>
  );
}
