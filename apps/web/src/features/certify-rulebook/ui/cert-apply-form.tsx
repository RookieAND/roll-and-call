"use client";

import { Badge, Button, Callout, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { Info } from "lucide-react";
import { useRef, useState } from "react";

import {
  CERT_SHOT,
  CERT_SHOTS,
  CERT_STATE,
  RULEBOOK_KIND,
  type CertShot,
  type MyRulebook,
} from "@/entities/rulebook";
import { useAction } from "@/shared/ui";

import { submitCertification } from "../api/submit-certification";
import { uploadCertPhoto } from "../api/upload-cert-photo";
import { applyHint } from "../model/apply-hint";
import { certPhotoError } from "../model/cert-photo-error";
import { CERT_PHOTO_ACCEPT } from "../model/cert-photo-rules";
import type { CertPhotos } from "../model/cert-photos";
import { initialSelection } from "../model/initial-selection";
import { initialSlots } from "../model/initial-slots";
import { PHOTO_SLOT, type PhotoSlot } from "../model/photo-slot";
import { EMPTY_PURCHASE } from "../model/purchase-record";
import { CertRulebookSheet } from "./cert-rulebook-sheet";
import { PhotoTile } from "./photo-tile";
import { PurchaseRecordFields } from "./purchase-record-fields";
import { RulebookField } from "./rulebook-field";
import { RulebookRequestSheet } from "./rulebook-request-sheet";
import { ShotGuide } from "./shot-guide";
import { StepHeading } from "./step-heading";

const CHECKS = [
  "인증을 받으면 프로필에 이 룰북의 배지가 공개됩니다.",
  "제출한 사진과 구매 기록은 인증이 유지되는 동안 보관합니다.",
];

const REQUIRED_BADGE = <Badge colorPalette="primary">필수</Badge>;

interface CertApplyFormProps {
  rulebooks: MyRulebook[];
  initialRulebookIds: string[];
  nickname: string;
}

export function CertApplyForm({ rulebooks, initialRulebookIds, nickname }: CertApplyFormProps) {
  const [rulebookIds, setRulebookIds] = useState(() =>
    initialSelection(rulebooks, initialRulebookIds),
  );
  const onlyRulebook = (ids: string[]) =>
    ids.length === 1 ? rulebooks.find((rulebook) => rulebook.id === ids[0]) : undefined;
  const [slots, setSlots] = useState(() => initialSlots(onlyRulebook(rulebookIds)));
  const [purchase, setPurchase] = useState(EMPTY_PURCHASE);
  const [selectedShot, setSelectedShot] = useState<CertShot>(CERT_SHOT.front);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { pending, run } = useAction();

  const selected = rulebooks.filter((rulebook) => rulebookIds.includes(rulebook.id));
  const paired = selected.length > 1;
  const handbook = selected.some((rulebook) => rulebook.kind === RULEBOOK_KIND.handbook);
  const photoCount = CERT_SHOTS.filter((shot) => slots[shot].status === PHOTO_SLOT.done).length;
  const hint = applyHint(selected.length > 0, photoCount);
  const categoryNames = [...new Set(rulebooks.map((rulebook) => rulebook.categoryName))];

  const setSlot = (shot: CertShot, slot: PhotoSlot) =>
    setSlots((current) => ({ ...current, [shot]: slot }));

  const selectRulebooks = (ids: string[]) => {
    setRulebookIds(ids);
    const only = onlyRulebook(ids);
    if (only?.state === CERT_STATE.rejected) setSlots(initialSlots(only));
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
    if (rulebookIds.length === 0) return;
    const photos = Object.fromEntries(
      CERT_SHOTS.map((shot) => {
        const slot = slots[shot];
        return [shot, slot.status === PHOTO_SLOT.done ? slot.url : ""];
      }),
    ) as CertPhotos;
    run(() => submitCertification(rulebookIds, photos, purchase));
  };

  const selectedError =
    slots[selectedShot].status === PHOTO_SLOT.error ? slots[selectedShot] : null;

  return (
    <>
      <Container size="sm">
        <VStack gap="300" className="pt-225 pb-250">
          <Callout.Root>
            <Callout.Icon />
            <Callout.Description className="break-keep [text-wrap:pretty]">
              실물 룰북을 찍은 사진 3장을 올리면 인증을 신청할 수 있습니다.
              <br />
              운영진이 인증하면 그 룰로 구인을 열 수 있습니다.
              <br />
              <Text weight="bold">전자책과 PDF 파일로는 인증할 수 없습니다.</Text>
            </Callout.Description>
          </Callout.Root>

          <VStack gap="125" render={<section />}>
            <StepHeading step={1} title="룰북" aside={REQUIRED_BADGE} />
            <RulebookField rulebooks={selected} onOpen={() => setPickerOpen(true)} />
            {paired && (
              <Text typography="body4" foreground="muted">
                {selected.length}권 모두 인증받아야 GM을 열 수 있습니다.
              </Text>
            )}
            {handbook && (
              <Callout.Root colorPalette="notice">
                <Callout.Icon />
                <Callout.Description className="break-keep [text-wrap:pretty]">
                  핸드북은 플레이어용이라 GM 자격이 되지 않습니다.
                  <br />
                  인증을 받으면 프로필에 배지로 보입니다.
                </Callout.Description>
              </Callout.Root>
            )}
          </VStack>

          <VStack gap="125" render={<section />}>
            <StepHeading
              step={2}
              title="사진 3장"
              aside={
                <>
                  <Text typography="body3" weight="bold" foreground="muted" numeric>
                    {photoCount} / 3
                  </Text>
                  {REQUIRED_BADGE}
                </>
              }
            />
            <div className="flex gap-100">
              {CERT_SHOTS.map((shot) => (
                <PhotoTile
                  key={shot}
                  shot={shot}
                  slot={slots[shot]}
                  selected={shot === selectedShot}
                  needed={selected.length > 0}
                  paired={paired}
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
            <ShotGuide shot={selectedShot} bookCount={selected.length} nickname={nickname} />
            <Text typography="body4" foreground="hint" render={<p />}>
              사진은 JPG와 PNG 형식만 올릴 수 있습니다.
              <br />
              사진 한 장의 크기는 10MB를 넘을 수 없습니다.
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
            <StepHeading step={3} title="구매 기록" aside={<Badge>선택</Badge>} />
            <Text typography="body4" foreground="muted" className="-mt-050">
              사진만으로 확인하기 어려울 때 참고합니다.
            </Text>
            <PurchaseRecordFields value={purchase} onChange={setPurchase} />
          </VStack>

          <VStack gap="100" render={<ul />} className="border-t border-gray-100 pt-100">
            {CHECKS.map((check) => (
              <Text
                key={check}
                typography="body3"
                foreground="muted"
                render={<li />}
                className="flex gap-100 pt-050"
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
                {paired ? `${selected.length}권 인증 신청` : "인증 신청"}
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
        selectedIds={rulebookIds}
        onConfirm={selectRulebooks}
        onRequest={() => {
          setPickerOpen(false);
          setRequestOpen(true);
        }}
      />
      <RulebookRequestSheet
        open={requestOpen}
        onOpenChange={setRequestOpen}
        categoryNames={categoryNames}
      />
    </>
  );
}
