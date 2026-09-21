import { Card, Text, VStack, cn } from "@trpg/ui";

interface RosterStatProps {
  label: string;
  count: number | null;
  caption?: string;
  danger?: boolean;
}

// count가 null이면 아직 셀 수 없는 값이다(출석 확인 전). 0과 구분해 줄표로 둔다.
export function RosterStat({ label, count, caption, danger }: RosterStatProps) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <VStack gap="050">
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <Text
          numeric
          typography="heading2"
          className={cn(count === null && "text-gray-400", danger && "text-danger-600")}
        >
          {count === null ? "—" : `${count}명`}
        </Text>
        {caption && (
          <Text typography="body4" foreground="muted">
            {caption}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
