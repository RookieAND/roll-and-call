"use client";

import { Grid } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { PhotoThumb, PhotoViewer } from "@/shared/ui";

interface ReviewPhotosProps {
  photoUrls: string[];
  title: string;
  subtitle: string;
  spoiler: boolean;
}

export function ReviewPhotos({ photoUrls, title, subtitle, spoiler }: ReviewPhotosProps) {
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
      {isNull(openIndex) ? null : (
        <PhotoViewer
          photos={photoUrls}
          title={title}
          subtitle={subtitle}
          spoiler={spoiler}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
