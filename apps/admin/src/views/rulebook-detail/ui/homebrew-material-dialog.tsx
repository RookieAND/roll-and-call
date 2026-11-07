"use client";

import { Button, Grid, Text, VStack } from "@roll-and-call/ui";

import type { HomebrewRuleInfo } from "@/entities/homebrew/server";
import {
  MODAL_FOOTER_CLASS,
  ModalServerLabel,
  ResponsiveDialog,
  ZoomablePhotos,
} from "@/shared/ui";

import { HomebrewImageError } from "./homebrew-image-error";
import { HomebrewLinkRow } from "./homebrew-link-row";

interface HomebrewMaterialDialogProps {
  open: boolean;
  ruleLabel: string;
  info: Pick<HomebrewRuleInfo, "links" | "images">;
  onClose: () => void;
}

// 읽기 전용이다. 자료를 고치는 입구는 두지 않는다.
export function HomebrewMaterialDialog({
  open,
  ruleLabel,
  info,
  onClose,
}: HomebrewMaterialDialogProps) {
  const photos = info.images.flatMap((image) => (image.url ? [image.url] : []));
  const brokenImages = info.images.filter((image) => !image.url);
  return (
    <ResponsiveDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || onClose()}>
      <ResponsiveDialog.Popup className="max-w-[720px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>심사 자료</ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <VStack gap="200">
            {info.links.length > 0 ? (
              <VStack gap="100" render={<section />}>
                <Text typography="body4" weight="bold" foreground="muted" render={<h3 />}>
                  링크
                </Text>
                <VStack gap="075" render={<ul />}>
                  {info.links.map((url) => (
                    <HomebrewLinkRow key={url} url={url} />
                  ))}
                </VStack>
              </VStack>
            ) : null}
            {info.images.length > 0 ? (
              <VStack gap="100" render={<section />}>
                <Text typography="body4" weight="bold" foreground="muted" render={<h3 />}>
                  이미지
                </Text>
                <Grid className="grid-cols-3 gap-100 max-lg:grid-cols-2">
                  <ZoomablePhotos
                    photos={photos}
                    title={ruleLabel}
                    subtitle="심사 이미지"
                    thumbLabel="이미지"
                    className="h-[150px] w-full"
                  />
                  {brokenImages.map((image) => (
                    <HomebrewImageError key={image.key} />
                  ))}
                </Grid>
              </VStack>
            ) : null}
          </VStack>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close render={<Button variant="ghost" colorPalette="gray" />}>
            닫기
          </ResponsiveDialog.Close>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
