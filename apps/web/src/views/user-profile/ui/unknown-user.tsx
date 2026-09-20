import { Avatar, Text } from "@trpg/ui";

export function UnknownUser() {
  return (
    <div className="flex items-center gap-3.5 px-4 pt-5 pb-4">
      <Avatar name={null} size="2xl" className="h-16 w-16 text-heading1" />
      <Text typography="heading2" render={<h1 />} className="tracking-[-0.02em]">
        알 수 없는 사용자
      </Text>
    </div>
  );
}
