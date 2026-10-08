import { Text, VStack } from "@roll-and-call/ui";

const SCOPE_NOTES = [
  "적용일이 비어 있으면 인증 규칙이 바로 적용됩니다.",
  "‘인증 불필요’ 룰북은 적용일과 관계없이 그대로입니다.",
  "이미 열린 구인은 적용일이 바뀌어도 그대로 진행됩니다.",
];

export function EnforcementScope() {
  return (
    <VStack render={<ul />} gap="075">
      {SCOPE_NOTES.map((note) => (
        <Text key={note} typography="body4" foreground="muted" render={<li />}>
          {note}
        </Text>
      ))}
    </VStack>
  );
}
