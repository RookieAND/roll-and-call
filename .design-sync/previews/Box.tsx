import { Box, Text } from "@trpg/ui";

export const Default = () => (
  <Box className="rounded-[14px] border border-gray-200 bg-gray-50 p-4">
    <Text typography="subtitle1">안내</Text>
    <Text typography="body3" foreground="muted" render={<p />}>
      Box는 className만 받는 div 래퍼입니다. 레이아웃은 Tailwind 유틸리티로 지정합니다.
    </Text>
  </Box>
);
