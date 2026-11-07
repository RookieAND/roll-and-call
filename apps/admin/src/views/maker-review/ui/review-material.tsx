import { Text, VStack } from "@roll-and-call/ui";

import { HomebrewImageGrid } from "./homebrew-image-grid";
import { MaterialLinkRow } from "./material-link-row";

interface ReviewMaterialProps {
  links: string[];
  images: { key: string; url: string | null }[];
  ruleName: string;
}

export function ReviewMaterial({ links, images, ruleName }: ReviewMaterialProps) {
  return (
    <VStack gap="200">
      {links.length > 0 ? (
        <VStack gap="100">
          <Text typography="body4" weight="bold" foreground="muted">
            링크
          </Text>
          {links.map((url) => (
            <MaterialLinkRow key={url} url={url} />
          ))}
          <Text typography="body4" foreground="hint">
            열리지 않으면 「자료를 열 수 없음」으로 반려해 주세요.
          </Text>
        </VStack>
      ) : null}
      {images.length > 0 ? (
        <VStack gap="100">
          <Text typography="body4" weight="bold" foreground="muted">
            이미지
          </Text>
          <HomebrewImageGrid images={images} ruleName={ruleName} />
        </VStack>
      ) : null}
    </VStack>
  );
}
