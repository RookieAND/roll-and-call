import { Text, cn } from "@roll-and-call/ui";

interface AsideHeadingProps {
  children: string;
  className?: string;
}

export function AsideHeading({ children, className }: AsideHeadingProps) {
  return (
    <Text
      typography="heading3"
      render={<h2 />}
      className={cn(
        "border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125",
        className,
      )}
    >
      {children}
    </Text>
  );
}
