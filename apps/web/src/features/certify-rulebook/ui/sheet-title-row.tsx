import { Button, HStack, Sheet, Text } from "@roll-and-call/ui";

interface SheetTitleRowProps {
  title: string;
}

export function SheetTitleRow({ title }: SheetTitleRowProps) {
  return (
    <HStack align="center" className="min-h-12 pr-050 pl-200">
      <Text typography="heading3" render={<h2 />} className="flex-1">
        {title}
      </Text>
      <Sheet.Close render={<Button variant="ghost" />}>닫기</Sheet.Close>
    </HStack>
  );
}
