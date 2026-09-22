import { HStack, Text } from "@roll-and-call/ui";

interface SlideEyebrowProps {
  number: string;
  label: string;
}

export function SlideEyebrow({ number, label }: SlideEyebrowProps) {
  return (
    <HStack align="center" gap="125">
      <Text
        typography="code2"
        weight="extrabold"
        foreground="white"
        render={<span />}
        className="flex h-7 w-7 flex-none items-center justify-center rounded-300 bg-primary-600"
      >
        {number}
      </Text>
      <Text typography="code2" weight="extrabold" foreground="primary" className="tracking-widest">
        {label}
      </Text>
    </HStack>
  );
}
