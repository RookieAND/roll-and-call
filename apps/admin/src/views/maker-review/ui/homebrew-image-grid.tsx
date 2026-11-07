"use client";

import { Button, Card, Grid, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PhotoViewer } from "@/shared/ui";

interface HomebrewImageGridProps {
  images: { key: string; url: string | null }[];
  ruleName: string;
}

// 3열 썸네일. 서명하지 못했거나 불러오지 못한 칸만 오류 칸으로 바꾸고, 누르면 확대 보기가 열린다.
export function HomebrewImageGrid({ images, ruleName }: HomebrewImageGridProps) {
  const router = useRouter();
  const [failedKeys, setFailedKeys] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const viewable = images.flatMap((image) =>
    image.url && !failedKeys.includes(image.key) ? [image.url] : [],
  );

  const retry = (image: { key: string; url: string | null }) => {
    if (isNull(image.url)) {
      router.refresh();
      return;
    }
    setFailedKeys(failedKeys.filter((key) => key !== image.key));
    setRetryCount(retryCount + 1);
  };

  return (
    <>
      <Grid cols={3} className="gap-100">
        {images.map((image, index) =>
          image.url && !failedKeys.includes(image.key) ? (
            <Card.Root
              key={image.key}
              radius={400}
              padding="none"
              interactive
              render={<button type="button" onClick={() => setOpenUrl(image.url)} />}
              aria-label={`이미지 ${index + 1} 확대`}
              className="h-[150px] w-full cursor-zoom-in overflow-hidden"
            >
              <img
                key={`${image.url}-${retryCount}`}
                src={image.url}
                alt=""
                onError={() => setFailedKeys([...failedKeys, image.key])}
                className="size-full object-cover"
              />
            </Card.Root>
          ) : (
            <VStack
              key={image.key}
              align="center"
              justify="center"
              gap="075"
              className="h-[150px] rounded-400 border border-gray-200 bg-(--rc-color-bg-secondary) px-100 text-center"
            >
              <Text typography="body4" foreground="muted">
                이미지를 불러오지 못했습니다.
              </Text>
              <Button variant="ghost" colorPalette="gray" size="sm" onClick={() => retry(image)}>
                <RotateCcw size={14} aria-hidden />
                다시 시도
              </Button>
            </VStack>
          ),
        )}
      </Grid>
      {isNull(openUrl) ? null : (
        <PhotoViewer
          photos={viewable}
          title={ruleName}
          subtitle="심사 이미지"
          spoiler={false}
          initialIndex={Math.max(viewable.indexOf(openUrl), 0)}
          onClose={() => setOpenUrl(null)}
        />
      )}
    </>
  );
}
