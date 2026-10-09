import { Text, VStack } from "@roll-and-call/ui";

import { toKst } from "@/shared/lib";

interface ApplicationNoteBlockProps {
  note: string;
  joinedAt: Date;
}

export function ApplicationNoteBlock({ note, joinedAt }: ApplicationNoteBlockProps) {
  return (
    <VStack gap="100" className="border-b border-gray-100 px-100 py-150">
      <Text typography="subtitle2" render={<h3 />} className="flex items-baseline justify-between">
        신청글
        <Text typography="body4" foreground="muted" numeric className="whitespace-nowrap">
          {`${toKst(joinedAt).format("M월 D일 HH:mm")} 신청`}
        </Text>
      </Text>
      <Text typography="body3" className="max-h-[40dvh] overflow-y-auto whitespace-pre-wrap">
        {note}
      </Text>
    </VStack>
  );
}
