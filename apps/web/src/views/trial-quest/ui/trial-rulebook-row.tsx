import { Badge, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { BookOpen, ChevronRight } from "lucide-react";

interface TrialRulebookRowProps {
  title: string;
  meta: string;
  badge: string;
  palette: "success" | "warning";
  onClick?: () => void;
}

export function TrialRulebookRow({ title, meta, badge, palette, onClick }: TrialRulebookRowProps) {
  const content = (
    <>
      <BookOpen size={18} aria-hidden className="flex-none text-hint" />
      <VStack className="min-w-0 flex-1 text-left">
        <Text typography="body2" weight="bold">
          {title}
        </Text>
        <Text typography="body4" foreground="hint">
          {meta}
        </Text>
      </VStack>
      <Badge colorPalette={palette}>{badge}</Badge>
      {onClick && <ChevronRight size={16} aria-hidden className="flex-none text-hint" />}
    </>
  );
  const className = "min-h-[62px] w-full border-t border-gray-100 px-175 py-100 first:border-t-0";
  if (!onClick) {
    return (
      <HStack align="center" gap="125" className={className}>
        {content}
      </HStack>
    );
  }
  return (
    <HStack
      align="center"
      gap="125"
      render={<button type="button" onClick={onClick} />}
      className={cn(className, "cursor-pointer")}
    >
      {content}
    </HStack>
  );
}
