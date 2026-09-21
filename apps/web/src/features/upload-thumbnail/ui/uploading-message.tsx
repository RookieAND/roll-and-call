import { Progress, Text } from "@trpg/ui";

interface UploadingMessageProps {
  percent: number;
}

export function UploadingMessage({ percent }: UploadingMessageProps) {
  return (
    <>
      <Progress value={percent} className="h-[5px] w-3/5 bg-gray-200" />
      <Text numeric typography="body4" foreground="muted">
        올리는 중 {percent}%
      </Text>
    </>
  );
}
