import { Card, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

const box = cva("rounded-500 px-175 py-150", {
  variants: {
    tone: {
      plain: "",
      success: "border-success-200 bg-success-100",
    },
  },
});

const ink = { plain: "normal", success: "success" } as const;

interface DrawStatProps {
  label: string;
  count: number;
  tone: "plain" | "success";
}

export function DrawStat({ label, count, tone }: DrawStatProps) {
  const labelForeground = tone === "plain" ? "hint" : ink[tone];

  return (
    <Card.Root padding="none" background="none" className={box({ tone })}>
      <Text typography="body4" foreground={labelForeground} render={<p />}>
        {label}
      </Text>
      <Text
        numeric
        typography="heading2"
        weight="extrabold"
        foreground={ink[tone]}
        render={<p />}
        className="mt-050"
      >
        {count}명
      </Text>
    </Card.Root>
  );
}
