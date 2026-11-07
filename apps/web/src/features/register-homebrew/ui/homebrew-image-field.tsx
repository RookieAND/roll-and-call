"use client";

import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { Field, Grid, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useRef, type ChangeEvent, type Dispatch, type SetStateAction } from "react";

import { CERT_PHOTO_ACCEPT, uploadCertPhoto } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

import { HOMEBREW_ERROR } from "../model/homebrew-error";
import type { HomebrewImage } from "../model/homebrew-image";
import { HomebrewImageTile } from "./homebrew-image-tile";

const ACCEPTED_TYPES = CERT_PHOTO_ACCEPT.split(",");

interface HomebrewImageFieldProps {
  serverId: string;
  images: HomebrewImage[];
  error: string | undefined;
  onImagesChange: Dispatch<SetStateAction<HomebrewImage[]>>;
  onErrorChange: (error: string | null) => void;
}

// ponytail: 화면을 떠날 때 남은 blob 미리보기는 풀지 않는다. 문서가 내려갈 때 함께 풀린다.
export function HomebrewImageField({
  serverId,
  images,
  error,
  onImagesChange,
  onErrorChange,
}: HomebrewImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const addable = images.length < HOMEBREW_LIMIT.images;

  const updateImage = (id: string, change: Partial<HomebrewImage>) =>
    onImagesChange((current) =>
      current.map((image) => (image.id === id ? { ...image, ...change } : image)),
    );

  async function upload(file: File) {
    const id = crypto.randomUUID();
    onImagesChange((current) => [...current, { id, key: null, previewUrl: "", progress: 0 }]);
    const result = await uploadCertPhoto({
      serverId,
      file,
      onProgress: (progress) => updateImage(id, { progress }),
    });
    if ("error" in result) {
      onImagesChange((current) => current.filter((image) => image.id !== id));
      onErrorChange(result.error);
      return;
    }
    updateImage(id, { key: result.key, previewUrl: result.previewUrl });
  }

  function pick(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const accepted = files.filter((file) => ACCEPTED_TYPES.includes(file.type));
    onErrorChange(accepted.length < files.length ? HOMEBREW_ERROR.imageFormat : null);
    accepted.slice(0, HOMEBREW_LIMIT.images - images.length).forEach((file) => void upload(file));
  }

  function remove(image: HomebrewImage) {
    if (image.previewUrl.startsWith("blob:")) URL.revokeObjectURL(image.previewUrl);
    onImagesChange((current) => current.filter((candidate) => candidate.id !== image.id));
  }

  return (
    <Field.Root label="이미지">
      <VStack gap="100">
        <Grid cols={3} gap="100">
          {addable && (
            // ponytail: 칸 전체가 누르는 자리라 Button 모양을 쓸 수 없다.
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-050 rounded-500 border-[1.5px] border-dashed border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-focus"
            >
              <Plus size={22} aria-hidden />
              <Text typography="body4" weight="medium" foreground="inherit">
                사진 추가
              </Text>
            </button>
          )}
          {images.map((image) => (
            <HomebrewImageTile key={image.id} image={image} onRemove={() => remove(image)} />
          ))}
        </Grid>
        <input
          ref={inputRef}
          type="file"
          accept={CERT_PHOTO_ACCEPT}
          multiple
          hidden
          onChange={pick}
        />
        {error && (
          <Text typography="body4" foreground="danger" role="alert">
            <LineBreaks lines={error.split("\n")} />
          </Text>
        )}
        <Text typography="body4" foreground="hint" render={<p />}>
          JPG, PNG 형식으로 장당 10MB까지 올릴 수 있습니다.
        </Text>
      </VStack>
    </Field.Root>
  );
}
