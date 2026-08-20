import { ErrorScreen } from "@/shared/ui/error-screen";

export default function NotFound() {
  return (
    <ErrorScreen
      title="페이지를 찾을 수 없습니다"
      description="주소가 바뀌었거나 삭제된 페이지예요."
    />
  );
}
