import { Text } from "@roll-and-call/ui";

interface AsideHeadingProps {
  children: string;
}

export function AsideHeading({ children }: AsideHeadingProps) {
  return (
    <Text
      typography="heading3"
      render={<h2 />}
      className="border-y border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125 first:border-t-0"
    >
      {children}
    </Text>
  );
}
