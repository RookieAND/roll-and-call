"use client";

import { Grid } from "@roll-and-call/ui";
import { useState } from "react";

import { PhotoThumb } from "@/shared/ui";

import { PhotoViewer } from "./photo-viewer";

interface ReviewPhotosProps {
  photoUrls: string[];
  title: string;
  meta: string;
  spoiler: boolean;
  hideLink: { label: string; href: string };
  removeHref: string;
}

export function ReviewPhotos({ photoUrls, ...viewer }: ReviewPhotosProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <>
      <Grid className="grid-cols-[repeat(3,88px)] gap-100">
        {photoUrls.map((url, index) => (
          <PhotoThumb
            key={url}
            url={url}
            label={`후기 사진 ${index + 1}/${photoUrls.length} 크게 보기`}
            onClick={() => setOpenIndex(index)}
          />
        ))}
      </Grid>
      <PhotoViewer
        photoUrls={photoUrls}
        index={openIndex}
        onIndexChange={setOpenIndex}
        {...viewer}
      />
    </>
  );
}
