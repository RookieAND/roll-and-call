import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { Badge, Button, Callout, Card, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Plus, X } from "lucide-react";
import Link from "next/link";

interface BookPickerPanelProps {
  books: { id: string; label: string; categoryName: string }[];
  bulk: boolean;
  applyHref: string;
  onRemove: (id: string) => void;
  onContinue: () => void;
}

export function MissingRulebookCallout({ href }: { href: string }) {
  return (
    <Callout.Root colorPalette="gray">
      <Callout.Icon />
      <Callout.Title>찾는 룰북이 목록에 없나요?</Callout.Title>
      <Callout.Description className="break-keep">
        목록에 없는 책은 추가를 요청해 주세요.
      </Callout.Description>
      <Callout.Action>
        <Button render={<Link href={href} />} variant="solid" colorPalette="primary" size="sm">
          <Plus size={14} strokeWidth={2.4} aria-hidden />
          추가 요청
        </Button>
      </Callout.Action>
    </Callout.Root>
  );
}

export function BookPickerPanel({
  books,
  bulk,
  applyHref,
  onRemove,
  onContinue,
}: BookPickerPanelProps) {
  return (
    <VStack gap="150">
      {bulk && (
        <Card.Root radius={500} padding="md">
          <VStack gap="150">
            <div className="flex items-center justify-between gap-100">
              <Text typography="subtitle1" render={<h2 />}>
                고른 책
              </Text>
              <Badge colorPalette="primary">{books.length}권</Badge>
            </div>
            {books.length > 0 ? (
              <ul aria-label="인증할 책 목록" className="max-h-[40dvh] space-y-100 overflow-y-auto">
                {books.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-start gap-100 rounded-300 bg-gray-50 p-125"
                  >
                    <div className="min-w-0 flex-1">
                      <Text typography="body3" weight="bold" className="block break-words">
                        {book.label}
                      </Text>
                      <Text typography="body5" foreground="muted" className="mt-025 block">
                        {book.categoryName}
                      </Text>
                    </div>
                    <IconButton
                      size="sm"
                      aria-label={`${book.categoryName} ${book.label} 선택 해제`}
                      onClick={() => onRemove(book.id)}
                    >
                      <X size={15} />
                    </IconButton>
                  </li>
                ))}
              </ul>
            ) : (
              <Text typography="body3" foreground="muted" render={<p />}>
                왼쪽 목록에서 인증할 책을 골라 주세요.
              </Text>
            )}
            <Text typography="body4" foreground="muted" render={<p />}>
              한 번에 최대 {BULK_CERT_MAX_BOOKS}권까지 신청할 수 있습니다.
            </Text>
            {books.length > 0 && (
              <Button
                render={<Link href={applyHref} onClick={onContinue} />}
                size="lg"
                className="w-full"
              >
                {books.length}권 신청하기
              </Button>
            )}
          </VStack>
        </Card.Root>
      )}
    </VStack>
  );
}
