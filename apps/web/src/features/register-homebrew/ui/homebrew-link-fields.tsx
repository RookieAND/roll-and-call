import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { Button, Field, HStack, IconButton, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Plus, X } from "lucide-react";

import { LineBreaks } from "@/shared/ui";

import { linkErrorRow } from "../model/link-error-row";

const LINK_HELP = [
  "Google Docs, Google Drive, 노션 등 어떤 링크든 넣을 수 있습니다.",
  "링크가 있는 사람이 볼 수 있게 공유해 주세요.",
] as const;

interface HomebrewLinkFieldsProps {
  links: string[];
  error: string | undefined;
  onChange: (links: string[]) => void;
}

export function HomebrewLinkFields({ links, error, onChange }: HomebrewLinkFieldsProps) {
  const removable = links.length > 1;
  const addable = links.length < HOMEBREW_LIMIT.links;
  const errorRow = error ? linkErrorRow(links) : -1;

  return (
    <Field.Root label="링크">
      <VStack gap="100">
        {links.map((link, index) => (
          // ponytail: 칸은 값으로 구분할 수 없어(빈 칸이 여럿일 수 있다) 순서를 키로 쓴다.
          // oxlint-disable-next-line react/no-array-index-key
          <VStack key={index} gap="075">
            <HStack align="center" gap="050">
              <TextInput
                type="url"
                inputMode="url"
                placeholder="https://"
                aria-label={`링크 ${index + 1}`}
                value={link}
                invalid={index === errorRow}
                onChange={(event) => onChange(links.with(index, event.target.value))}
                className="min-w-0 flex-1"
              />
              {removable && (
                <IconButton
                  variant="ghost"
                  size="lg"
                  aria-label="링크 빼기"
                  onClick={() => onChange(links.toSpliced(index, 1))}
                >
                  <X size={20} aria-hidden />
                </IconButton>
              )}
            </HStack>
            {index === errorRow && (
              <Text typography="body4" foreground="danger" role="alert">
                {error}
              </Text>
            )}
          </VStack>
        ))}
        {addable && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => onChange([...links, ""])}
          >
            <Plus size={16} aria-hidden />
            링크 추가
          </Button>
        )}
        <Text typography="body4" foreground="hint" render={<p />}>
          <LineBreaks lines={LINK_HELP} />
        </Text>
      </VStack>
    </Field.Root>
  );
}
