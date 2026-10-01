import { ErrorScreen } from "@/shared/ui";

import { AppFrame } from "./app-frame";

export default function NotFound() {
  return (
    <AppFrame>
      <ErrorScreen
        title="페이지를 찾을 수 없습니다"
        description="주소가 바뀌었거나 삭제된 페이지예요."
      />
    </AppFrame>
  );
}
